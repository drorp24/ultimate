/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { scrolling, hide } from '../redux/app'

import bouncing from '../styling/bouncing'

import More from '@material-ui/icons/ExpandMoreOutlined'
import Fab from '@material-ui/core/Fab'

import isOverflown from '../utility/isOverflown'
import { atScrollTop, atScrollBottom } from '../utility/scrollPositions'

const Scroller = ({ textRef }) => {
  const [show, setShow] = useState()
  const [direction, setDirection] = useState('down')

  const {
    view: { relations, exclusiveRelations },
  } = useSelector(store => store.app)

  const dispatch = useDispatch()
  const text = textRef.current

  // allow the text box to open before checking if it is overflown
  useEffect(() => {
    if (!(relations || exclusiveRelations) || !text) {
      setShow(false)
      return
    }

    setTimeout(() => {
      if (isOverflown(text)) setShow(true)
    }, 1000)
  }, [exclusiveRelations, relations, text])

  // ToDo: the scroll code could be extracted out and used for other repositioning cases
  // (e.g., side drawer opening and closing) to make a smoother transition
  // that hides the nodes during the transition (recalculation & repositioning)
  const scroll = () => {
    // hide the nodes before scrolling, so they don't show up behind the text when it gets scrolled
    dispatch(hide({ relations: true }))

    // scroll smoothly
    const { height } = text.getBoundingClientRect()
    const top = direction === 'down' ? height : -1 * height
    const behavior = 'smooth'
    text.style.overflow = 'scroll'
    text.scrollBy({ top, behavior })

    // allow smooth scrolling to finish before
    // - reporting the scroll (for the nodes' positions to be recalculated)
    // - checking whether bottom or top have been reached
    setTimeout(() => {
      dispatch(scrolling())

      if (atScrollTop(text)) {
        setDirection('down')
      }
      if (atScrollBottom(text)) {
        setDirection('up')
      }
    }, 700)

    // allow the nodes' positions to be re-calculatedand and the nodes
    // to be repositioned, before showing them up again
    setTimeout(() => {
      dispatch(hide({ relations: false }))
    }, 1000)
  }

  const styles = {
    button: theme => ({
      visibility: show ? 'visible' : 'hidden',
      backgroundColor: `${theme.palette.grey[500]} !important`,
      zIndex: '1',
      '& > span': {
        transform: `rotate(${direction === 'up' ? 180 : 0}deg)`,
        transition: 'transform 0.5s',
      },
      '& svg': {
        position: 'static',
        color: 'rgba(256, 256, 256, 0.7) !important',
      },
    }),
    bounce: { ...(direction === 'down' && bouncing) },
  }

  return (
    <Fab size="small" css={styles.button} onClick={scroll}>
      <More css={styles.bounce} />
    </Fab>
  )
}

export default Scroller

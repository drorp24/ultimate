/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { fetchContent, error, changes } from '../redux/content'
import { setAppProp, scrolling } from '../redux/app'

import {
  Editor,
  EditorState,
  convertFromRaw,
  RichUtils,
  getDefaultKeyBinding,
} from 'draft-js'
import 'draft-js/dist/Draft.css'

import CircularProgress from '@material-ui/core/CircularProgress'

import Relations from '../relations/Relations'
import Selector, { emptyData } from './Selector'
import { createEntityFromSelection } from './entities'
import decorator from './decorator'
import parseSelection from './selection'
import EditorControl from './EditorControl'
import noScrollbar from '../styling/noScrollbar'
import Scroller from './Scroller'
import { throttleByFrame } from '../utility/debounce'

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )
  const [data, setData] = useState(emptyData)
  const [selectorOpen, setSelectorOpen] = useState(false)
  const ref = useRef()

  const { view, hide, drawerOpen, locale, mode } = useSelector(
    store => store.app
  )

  const dispatch = useDispatch()

  const uSetSelectorOpen = useCallback(setSelectorOpen, [setSelectorOpen])
  const uSetData = useCallback(setData, [setData])

  const handleChange = newEditorState => {
    // only report changes that have the potential to change entities positions
    // contentState immutability enables using referntial equality for comparison
    const oldContent = editorState.getCurrentContent()
    const newContent = newEditorState.getCurrentContent()
    const contentChanged = newContent !== oldContent
    if (contentChanged) dispatch(changes())

    setEditorState(newEditorState)

    const { selectionExists } = parseSelection(newEditorState)
    if (selectionExists) setSelectorOpen(true)
  }

  // ! No editing
  // Editing is probably not required.
  // However if it is ever required, then every key stroke would have to update all entityRanges in redux, or alternatively
  // decoratorComponents (dc) would have to find another way to find the index of the proper entityRange to update.
  // That update is required to keep reactflow's nodes on the same x/y coordinates as draft-js' entities.
  //
  // Failing to update their up-to-date offsets in redux will make cd's 'find' return -1 and content.js to throw,
  // since offsets *will* change in strategies.js.
  const myKeyBindingFn = e => {
    if (e.keyCode < 90) return 'editing'
    return getDefaultKeyBinding(e)
  }
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      this.onChange(newState)
      return 'handled'
    }

    return 'not-handled'
  }

  const reportScrolling = () => {
    dispatch(scrolling())
  }

  const styles = {
    container: theme => ({
      height: '100%',
      display: 'grid',
      gridTemplateColumns: '85% 5% 10%',
      gridTemplateRows: '50% 50%',
      gridTemplateAreas: `
      "editor space selector"
      "editor space control"
      `,
      overflow: 'hidden',
    }),
    editor: {
      gridArea: 'editor',
      overflow: 'scroll',
      position: 'relative',
      ...noScrollbar,
    },
    space: {
      gridArea: 'space',
    },
    selector: {
      gridArea: 'selector',
    },
    control: {
      gridArea: 'control',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    relations: {},
    scroller: {
      position: 'absolute',
      bottom: '0',
    },
    circularProgress: theme => ({
      position: 'fixed',
      top: '50%',
      left: locale === 'en' ? '30%' : '65%',
      '& > span': {
        color:
          mode === 'light' ? 'rgba(0, 0, 0, 0.5)' : theme.palette.grey[500],
      },
    }),
  }

  // conversion
  useEffect(() => {
    const convertContent = rawContent => convertFromRaw(rawContent)

    const showContent = content =>
      setEditorState(EditorState.createWithContent(content, decorator))

    dispatch(fetchContent({ convertContent, showContent }))
      .then(unwrapResult)
      .catch(serializedError => {
        console.error(serializedError)
        dispatch(error('content'))
      })
  }, [dispatch])

  // selection & entity creation
  useEffect(() => {
    const { selectionExists, selectionSpansBlocks } = parseSelection(
      editorState
    )
    if (selectionExists && selectionSpansBlocks) {
      // alert('Please select inside a single block') // ToDo: replace alert with a snackbar
      return
    }
    if (selectionExists && data.entityType) {
      const newEditorState = createEntityFromSelection({
        editorState,
        data,
        dispatch,
      })
      setEditorState(newEditorState)
      setData(emptyData)
    }
  }, [dispatch, editorState, data])

  // editor position
  useEffect(() => {
    const { x, y, width, height } = ref.current?.getBoundingClientRect() || {}
    const position = { x, y, width, height, scrolling: 0 }
    dispatch(setAppProp({ editor: position }))
  }, [dispatch, view.relations, view.exclusiveRelations, drawerOpen])

  // when view editor is off and relations are temporarily hidden (during scroll), text becomes empty
  const temporarilyEmpty = !view.editor && hide.relations

  // manual scroll prevention
  // this useCallback is imperative for the remove to use the same fn reference
  const preventManuallScrolling = useCallback(e => e.preventDefault(), [])
  useEffect(() => {
    const active = { passive: false }
    const text = ref.current

    if (view.relations || view.exclusiveRelations) {
      text.addEventListener('wheel', preventManuallScrolling, active)
    } else {
      text.removeEventListener('wheel', preventManuallScrolling)
    }
  }, [preventManuallScrolling, view.exclusiveRelations, view.relations])

  return (
    <div css={styles.container}>
      <div
        css={styles.editor}
        ref={ref}
        onScroll={throttleByFrame(reportScrolling)}
      >
        <div style={{ visibility: view.editor ? 'visible' : 'hidden' }}>
          <Editor
            editorState={editorState}
            onChange={handleChange}
            keyBindingFn={myKeyBindingFn}
            handleKeyCommand={handleKeyCommand}
            css={styles.editor}
          />
        </div>
        {temporarilyEmpty && (
          <div css={styles.circularProgress}>
            <CircularProgress />
          </div>
        )}
      </div>
      <div css={styles.space} />
      <div css={styles.selector}>
        <Selector
          {...{
            selectorOpen,
            uSetSelectorOpen,
            uSetData,
          }}
        />
      </div>
      <div css={styles.relations}>
        <Relations />
      </div>
      <div css={styles.control}>
        <EditorControl />
      </div>
      <div css={styles.scroller}>
        <Scroller textRef={ref} />
      </div>
    </div>
  )
}
export default MyEditor

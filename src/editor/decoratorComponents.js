/** @jsxImportSource @emotion/react */
import { memo, forwardRef } from 'react'
import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  updatePosition,
  selectContent,
  selectEntityById,
} from '../redux/content'

import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import { EntityDetails } from './EntityDetails'

import entityTypes, { entityStyle, entityIconStyle } from './entityTypes'

export const TextSpan = type => ({ children }) => (
  <span css={entityStyle(type)}>{children}</span>
)

// ! entities & ranges
// draft's text entities and reactflow's nodes are unaware of each other and render separately.
// In order to bring them together into one view, reactflow's nodes must follow the x/y coordinates of the entities.
//
// To achieve that, EntitySpan calls getBoundingClientRect on the ref of the native span whenever any of the useEffect's dependencies change,
// and reports it on the entity's respective entityRange.
// reactflow's nodes are built by scanning those entityRanges and then listen to their position changes, so that
// every change in each of the useEffect's dependencies will make the affected nodes move along with the respective text entity.
//
// The challenge is that draft doesnt maintain any id to uniquely identify an entityRange (occurrence) within an entity,
// so the only way of telling which entityRange is it whose position we need to update is by looking at the passed-in 'start' and 'end' props,
// and find the entityRange with the same start and end - but these change as soon as edit is allowed.
//
// This limitation of draft is a small price to pay for an otherwise very efficient character - entity - styling solution,
// and since no editing will probably ever be required, I disabled it, so that entityRanges would be found by their original offsets.
export const EntitySpan = ({
  contentState,
  entityKey,
  children,
  blockKey,
  start,
  end,
}) => {
  const ref = useRef()
  const entity = contentState.getEntity(entityKey)
  const { id } = entity.data

  const selectorEntity = useSelector(selectEntityById(id))
  const { loaded, entities } = useSelector(selectContent)
  const contentChanges = useSelector(store => store.content.changes)
  const { tags, relations } = useSelector(store => store.app.view)
  const {
    drawerOpen,
    editor: {
      x: editorX,
      y: editorY,
      width: editorWidth,
      height: editorHeight,
      scrolling,
    },
  } = useSelector(store => store.app)
  const { height: windowHeight, width: windowWidth } = useSelector(
    store => store.app.window
  )
  const dispatch = useDispatch()

  const of = ({ blockKey, start, end }) => item =>
    item.blockKey === blockKey &&
    item.offset === start &&
    item.length === end - start

  // if editing is ever allowed, this will break
  const entityRangeIndex =
    selectorEntity &&
    selectorEntity.entityRanges?.length &&
    selectorEntity.entityRanges.findIndex(of({ blockKey, start, end }))

  useEffect(() => {
    if (
      !loaded ||
      selectorEntity === undefined ||
      entityRangeIndex === undefined
    )
      return

    const reportIfPositionShifted = () => {
      const { x, y, width, height } = ref.current?.getBoundingClientRect() || {}

      if (x !== ref.current?.position?.x || y !== ref.current?.position?.y) {
        // keep prev position so only position changes would be reported
        const position = { x, y, width, height }
        ref.current.position = position

        // keep prev drawerOpen state and editor dimensions to detect changes that require setTimeout
        ref.current.drawerOpen = drawerOpen
        ref.current.editorX = editorX
        ref.current.editorY = editorY
        ref.current.editorWidth = editorWidth
        ref.current.editorHeight = editorHeight

        dispatch(updatePosition({ id, entityRangeIndex, position }))
      }
    }

    reportIfPositionShifted()

    if (
      relations && // delayed check is required only when relations is viewed
      (drawerOpen !== ref.current.drawerOpen ||
        editorX !== ref.current.editorX ||
        editorY !== ref.current.editorY ||
        editorWidth !== ref.current.editorWidth ||
        editorHeight !== ref.current.editorHeight)
    ) {
      setTimeout(reportIfPositionShifted, 500)
    }
  }, [
    loaded,
    entities.length,
    contentChanges,
    windowHeight,
    windowWidth,
    id,
    entityRangeIndex,
    selectorEntity,
    tags,
    drawerOpen,
    editorX,
    editorY,
    editorWidth,
    editorHeight,
    dispatch,
    relations,
    scrolling,
  ])

  return <Entity {...{ contentState, entityKey, children, tags, ref }} />
}

// memo ensures position changes do not trigger unnecessary re-rendering
// forwardRef enables using this component's ref in parent component
const Entity = memo(
  forwardRef(({ contentState, entityKey, children, tags }, ref) => {
    const entity = contentState.getEntity(entityKey)
    const { type } = entity
    const { icon } = entityTypes[type]
    const role = 'text'
    const entityS = entityStyle({ type, role })
    const iconS = entityIconStyle({ type, role })

    return (
      <Tooltip
        // open={true}
        title={<EntityDetails {...{ entity }} />}
        arrow
        TransitionComponent={Zoom}
        disableFocusListener={true}
        placement="left"
      >
        <span ref={ref} {...(tags && { style: entityS })}>
          <span style={iconS}>{tags && icon}</span>
          {children}
        </span>
      </Tooltip>
    )
  })
)

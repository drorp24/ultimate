import entityTypes, { relationTypes } from '../editor/entityTypes'
// import ConnectionLine from './ConnectionLine'

export const options = {
  nodesDraggable: false,
  zoomOnScroll: false,
  zoomOnDoubleClick: false,
  paneMoveable: false,
  connectionMode: 'loose',
  deleteKeyCode: 46,
}

export const makeNode = ({
  id,
  type,
  data,
  index,
  x,
  y,
  width,
  height,
  nodeStyle,
  editRelations,
  text,
}) => ({
  id: `${id}-${index}`,
  type: 'node',
  position: { x, y },
  style: {
    width,
    height,
    ...nodeStyle,
  },
  sourcePosition: 'right',
  targetPosition: 'left',
  data: { ...data, editRelations, type, index, text },
})

export const relationOptions = ({ type, entityFromType }) => ({
  label: type,
  style: {
    stroke: entityTypes[entityFromType].color,
    strokeWidth: '4',
  },
  labelStyle: {
    // fill: entityTypes[relationTypes[type].entity].color,
    fill: 'yellow',
    fontSize: '0.8rem',
    fontWeight: '400',
  },
  labelBgStyle: {
    textAlign: 'center',
    fill: 'rgba(0, 0, 0, 0.6)',
  },
  labelBgBorderRadius: '4',
  labelBgPadding: [5, 2],
  animated: true,
})

export const makeRelation = ({
  from,
  fromEntityRangeIndex,
  to,
  toEntityRangeIndex,
  type,
  exclusiveRelations,
  selected,
  entityFromType,
}) => {
  const source = `${from}-${fromEntityRangeIndex}`
  const target = `${to}-${toEntityRangeIndex}`
  const isHidden =
    exclusiveRelations && selected && selected !== from && selected !== to
  const relation = {
    id: `${source}-${target}-${type}`,
    source: `${source}`,
    sourceHandle: `${from}-${to}-${type}`,
    target: `${target}`,
    targetHandle: `${to}-${from}-${type}`,
    isHidden,
    ...relationOptions({ type, entityFromType }),
  }
  return relation
}

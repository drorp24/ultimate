import { useSelector } from 'react-redux'

import { Handle } from 'react-flow-renderer'

import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'

import entityTypes, {
  relationTypes,
  entityStyle,
  entityIconStyle,
} from '../editor/entityTypes'
import { styles } from './Relations'

export const Node = ({ id, data: { inputs, outputs, type, text } }) => {
  const { editor, connections } = useSelector(store => store.app.view)
  const showText = editor ? false : true
  const handlesVisibility = connections ? 'visible' : 'hidden'
  const { icon } = entityTypes[type]
  const role = 'node'

  return (
    <>
      {outputs &&
        outputs.map(({ source, target, type }) => (
          <Handle
            type="source"
            id={`${source}-${target}-${type}`}
            key={target}
            position="right"
            style={{
              ...styles.handleStyle,
              backgroundColor: entityTypes[relationTypes[type].entity].color,
              visibility: handlesVisibility,
            }}
          />
        ))}
      <Handle
        type="source"
        id="extraSource"
        key="extraSource"
        position="bottom"
        style={{
          ...styles.handleStyle,
          backgroundColor: green[500],
          visibility: handlesVisibility,
        }}
      />
      {showText && (
        <span style={entityStyle({ type, role })}>
          <span style={entityIconStyle({ type, role })}>{icon}</span>
          <span>{text}</span>
        </span>
      )}
      {inputs &&
        inputs.map(({ source, target, type }) => (
          <Handle
            type="target"
            id={`${target}-${source}-${type}`}
            key={source}
            position="left"
            style={{
              ...styles.handleStyle,
              backgroundColor: entityTypes[relationTypes[type].entity].color,
              visibility: handlesVisibility,
            }}
          />
        ))}
      <Handle
        type="target"
        id="extraTarget"
        key="extraTarget"
        position="top"
        style={{
          ...styles.handleStyle,
          backgroundColor: red[500],
          visibility: handlesVisibility,
        }}
      />
    </>
  )
}

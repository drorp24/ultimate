/** @jsxImportSource @emotion/react */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { view } from '../redux/app'

import ToggleButton from '@material-ui/core/ToggleButton'

import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup'
import AccountTreeIcon from '@material-ui/icons/AccountTreeOutlined'
import LabelIcon from '@material-ui/icons/LabelOutlined'
import TextIcon from '@material-ui/icons/DescriptionOutlined'
import Tooltip from '@material-ui/core/Tooltip'
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined'

const styles = {
  root: theme => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  buttonGroup: theme => ({
    border: `3px solid rgba(0, 0, 0, 0.15)`,
  }),
  button: {
    '& svg': {
      fontSize: '1.2rem',
    },
  },
  off: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.7)',
  },
  on: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    borderColor: 'white',
  },
  disabled: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.1)',
    pointerEvents: 'none',
  },
}

// ToDo: find out why leaving 'editor' alone in the initial state makes reactflow's edges wrongly positioned
const EditorControl = () => {
  const [selected, setSelected] = useState(['editor', 'tags'])
  const dispatch = useDispatch()

  const [editorDisabled] = useState(false)
  const [tagsDisabled] = useState(false)
  const [relationsDisabled, setRelationsDisabled] = useState(false)
  const [connectionsDisabled, setConnectionsDisabled] = useState(false)

  const editorSelected = useMemo(() => selected.includes('editor'), [selected])
  const tagsSelected = useMemo(() => selected.includes('tags'), [selected])
  const relationsSelected = useMemo(() => selected.includes('relations'), [
    selected,
  ])
  const connectionsSelected = useMemo(() => selected.includes('connections'), [
    selected,
  ])

  const dispatchSelected = useCallback(() => {
    dispatch(
      view({
        editor: editorSelected,
        tags: tagsSelected,
        relations: relationsSelected,
        connections: connectionsSelected,
      })
    )
  }, [
    editorSelected,
    tagsSelected,
    relationsSelected,
    connectionsSelected,
    dispatch,
  ])

  useEffect(() => {
    dispatchSelected()

    setRelationsDisabled(!tagsSelected)
    if (!tagsSelected && relationsSelected)
      setSelected(selected => selected.filter(i => i !== 'relations'))

    setConnectionsDisabled(!relationsSelected)
    if (!relationsSelected && connectionsSelected)
      setSelected(selected => selected.filter(i => i !== 'connections'))
  }, [
    editorSelected,
    tagsSelected,
    relationsSelected,
    connectionsSelected,
    dispatchSelected,
  ])

  const handleDisplay = (event, newSelected) => {
    setSelected(newSelected)
    dispatchSelected()
  }

  const { on, off, disabled } = styles

  return (
    <div css={styles.root}>
      <ToggleButtonGroup
        orientation="vertical"
        size="small"
        css={styles.buttonGroup}
        value={selected}
        onChange={handleDisplay}
      >
        <Tooltip title="Show text" placement="left">
          <ToggleButton
            value="editor"
            selected={editorSelected}
            css={styles.button}
            style={editorDisabled ? disabled : editorSelected ? on : off}
          >
            <TextIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Show tags" placement="left">
          <ToggleButton
            value="tags"
            selected={tagsSelected}
            css={styles.button}
            style={tagsDisabled ? disabled : tagsSelected ? on : off}
          >
            <LabelIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Show relations" placement="left">
          <ToggleButton
            value="relations"
            selected={relationsSelected}
            css={styles.button}
            style={relationsDisabled ? disabled : relationsSelected ? on : off}
          >
            <AccountTreeIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Edit relations" placement="left">
          <ToggleButton
            value="connections"
            selected={connectionsSelected}
            css={styles.button}
            style={
              connectionsDisabled ? disabled : connectionsSelected ? on : off
            }
          >
            <BorderColorOutlinedIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </div>
  )
}

export default EditorControl

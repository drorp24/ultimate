/** @jsxImportSource @emotion/react */
import { memo, useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectContent, updateTag, selectIds } from '../redux/content'
import { useDirection } from '../utility/appUtilities'

import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

import ToggleButton from '@material-ui/core/ToggleButton'
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup'
import Yes from '@material-ui/icons/ThumbUpOutlined'
import Maybe from '@material-ui/icons/HelpOutlineOutlined'
import No from '@material-ui/icons/ThumbDownOutlined'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import Info from '@material-ui/icons/InfoOutlined'
import IconButton from '@material-ui/core/IconButton'

import { useIntl } from 'react-intl'

import entityTypes from '../editor/entityTypes'
import { EntityDetails } from '../editor/EntityDetails'

import usePixels from '../utility/usePixels'
import noScrollbar from '../styling/noScrollbar'

const styles = {
  autoSizer: {
    width: '100%',
  },
  header: {
    fontWeight: '700',
    padding: '0 1rem',
    color: '#9e9e9e',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '7% 23% auto 7% 7% 23%',
    columnGap: '0.5rem',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  lightEven: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  darkEven: {
    backgroundColor: 'rgba(256, 256, 256, 0.05)',
  },
  odd: {},
  rowHover: {
    border: '3px solid rgba(0, 0, 0, 0.2)',
  },
  cell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    // border: '1px solid',
  },
  icon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '3rem',
    width: '3rem',
    alignSelf: 'center',
  },

  selectedInfo: {
    color: '#fff',
  },
  typeIcon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '0 1rem',
  },
  tagHeader: {
    textAlign: 'center',
  },
  buttonGroup: {
    height: '2rem',
    justifySelf: 'end',
    alignSelf: 'center',
    padding: '0 1rem',
    // border: '1px solid',
  },
  selected: {
    backgroundColor: 'rgba(0, 0, 0, 0.6) !important',
    color: '#fff !important',
  },
  on: {
    backgroundColor: 'rgba(0, 0, 0, 0.6) !important',
    color: '#fff !important',
  },
  off: {
    color: 'rgba(0, 0, 0, 0.1) !important',
  },
  tagIcon: {
    fontSize: '1rem !important',
  },
  selectedTagIcon: {
    color: 'rgba(256, 256, 256, 0.2)',
  },
  selectedTagIconOn: {
    color: 'white !important',
  },
  dimText: {
    color: '#9e9e9e',
  },
  centered: {
    textAlign: 'center',
  },
  table1: theme => ({
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  }),
}

// ToDo: make ToggleButtonGroup responsive

const Table = () => {
  // the 'entities' selector maintains entities' sort order
  const { entities, selected } = useSelector(selectContent)
  const ids = useSelector(selectIds)
  const itemCount = entities.length
  const itemSize = usePixels(4)
  const direction = useDirection()
  const outerRef = useRef()

  useEffect(() => {
    const scrollTo = entityId => {
      if (!outerRef || !outerRef.current) return

      const index = ids.findIndex(id => id === entityId)
      const top = index * itemSize
      outerRef.current.scrollTo({ top, behavior: 'smooth' })
    }
    if (selected) scrollTo(selected)
  }, [ids, itemSize, selected])

  return (
    <AutoSizer style={styles.autoSizer}>
      {({ height, width }) => {
        height -= itemSize
        return (
          <>
            <Header
              style={{ ...styles.row, ...styles.header, height: itemSize }}
            />
            <List
              overscanCount="10"
              outerRef={outerRef}
              css={noScrollbar}
              {...{ height, width, itemCount, itemSize, direction }}
            >
              {Row}
            </List>
          </>
        )
      }}
    </AutoSizer>
  )
}

// ToDo: style tag buttons properly when row is selected

const Row = memo(({ index, style }) => {
  const { entities, selected } = useSelector(selectContent)
  const { mode } = useSelector(store => store.app)
  const dispatch = useDispatch()

  const entity = entities[index]
  const {
    type,
    data: { id, score, geoLocation, tag: currentTag },
    entityRanges,
  } = entity

  const [tag, setTag] = useState(currentTag)

  const { icon, color } = entityTypes[type]
  const { text } = entityRanges[0]
  const place = geoLocation?.properties?.name || ''
  const bg =
    index % 2
      ? styles.odd
      : mode === 'light'
      ? styles.lightEven
      : styles.darkEven
  const line = { lineHeight: `${style.height}px` }

  const selectedRow = id === selected ? styles.selected : {}
  const selectedTagIcon = id === selected ? styles.selectedTagIcon : {}
  const selectedInfo = id === selected ? styles.selectedInfo : {}

  const tagState = {
    yes: 'off',
    maybe: 'off',
    no: 'off',
  }
  tagState[tag] = 'on'

  const tagClick = id => (e, tag) => {
    dispatch(updateTag({ id, tag }))
    setTag(tag)
  }

  return (
    <div
      css={{
        ...style,
        ...styles.row,
        ...bg,
        ...line,
        ...selectedRow,
      }}
      style={style}
    >
      <Cell
        value={type}
        icon={icon}
        cellStyle={{ ...styles.typeIcon, color }}
      />
      <Cell value={text} cellStyle={{ ...styles.centered }} />
      <Cell value={place} />
      <Cell value={score} cellStyle={{ ...styles.dimText }} />
      <Tooltip
        title={<EntityDetails {...{ entity }} />}
        arrow
        TransitionComponent={Zoom}
        disableFocusListener={true}
        placement="right"
      >
        <IconButton
          style={{ ...styles.icon, ...selectedInfo, ...styles.dimText }}
        >
          <Info />
        </IconButton>
      </Tooltip>

      <ToggleButtonGroup
        value={tag}
        exclusive
        onChange={tagClick(id)}
        size="small"
        css={styles.buttonGroup}
      >
        <ToggleButton value="yes" title="Yes" css={styles[tagState['yes']]}>
          <Yes css={{ ...styles.tagIcon, ...selectedTagIcon }} />
        </ToggleButton>
        <ToggleButton
          value="maybe"
          title="Maybe"
          css={styles[tagState['maybe']]}
        >
          <Maybe css={{ ...styles.tagIcon, ...selectedTagIcon }} />
        </ToggleButton>
        <ToggleButton value="no" title="No" css={styles[tagState['no']]}>
          <No css={{ ...styles.tagIcon, ...selectedTagIcon }} />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
})

const Header = memo(({ style }) => {
  const intl = useIntl()
  const line = { lineHeight: `${style.height}px` }

  return (
    <div style={{ ...style, ...line }}>
      <Cell value={intl.formatMessage({ id: 'type' })} />
      <Cell
        value={intl.formatMessage({ id: 'entity' })}
        cellStyle={{ textAlign: 'center' }}
      />
      <Cell value={intl.formatMessage({ id: 'place' })} />
      <Cell
        value={intl.formatMessage({ id: 'score' })}
        cellStyle={{ textAlign: 'right' }}
      />
      <Cell
        value={intl.formatMessage({ id: 'info' })}
        cellStyle={{ textAlign: 'center' }}
      />
      <Cell
        value={intl.formatMessage({ id: 'tag' })}
        cellStyle={styles.tagHeader}
      />
    </div>
  )
})

const Cell = ({ value, icon, cellStyle }) => {
  const alignment = typeof value === 'number' ? { textAlign: 'right' } : {}
  return (
    <div style={{ ...styles.cell, ...cellStyle, ...alignment }} title={value}>
      {icon || value}
    </div>
  )
}

export default Table

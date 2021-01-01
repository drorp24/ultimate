/** @jsxImportSource @emotion/react */
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'

import { FormattedMessage } from 'react-intl'

import Editor from '../editor/Editor'
import Table from '../table/Table'
import Map from '../map/Map'
import Logout from '../auth/Logout'
import noScrollbar from '../styling/noScrollbar'

const heights = {
  search: 6,
  editor: 50,
}
const Locations = () => {
  const {
    view: { relations },
    mode,
    locale,
  } = useSelector(store => store.app)

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: '50% 50%',
      overflow: 'scroll',
      ...noScrollbar,
    },
    paper: {
      height: '100%',
      zIndex: '401',
      overflow: 'hidden',
    },
    input: theme => ({
      height: `${heights.search}%`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1.5rem',
      backgroundColor: mode === 'light' ? '#616161' : '#333',
      color: mode === 'light' ? 'white' : theme.palette.grey[500],
      fontWeight: '100',
      textTransform: 'capitalize',
      fontSize: locale === 'he' ? '1rem' : '0.8125rem',
    }),
    editor: {
      height: relations ? `${100 - heights.search}%` : `${heights.editor}%`,
      lineHeight: relations ? '6' : '3',
      transition: 'height 0.7s',
      padding: '0 1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    table: {
      height: `${100 - heights.search - heights.editor}%`,
      padding: '0 1rem',
      backgroundColor: mode === 'light' ? 'inherit' : 'rgba(0, 0, 0, 0.2)',
    },
    map: {},
  }

  return (
    <div css={styles.container}>
      <Paper square elevation={4} css={styles.paper}>
        <div css={styles.input}>
          <div>
            <FormattedMessage id="fileId" />
          </div>
          <div>
            <Logout noButton />
          </div>
        </div>
        <Divider />
        <div css={styles.editor}>
          <Editor />
        </div>
        <Divider />
        <div css={styles.table}>
          <Table />
        </div>
      </Paper>
      <div css={styles.map}>
        <Map />
      </div>
    </div>
  )
}

export default Locations

/** @jsxImportSource @emotion/react */
import { useSelector, useDispatch } from 'react-redux'
import { selected } from '../redux/content'
import { view } from '../redux/app'

import entityTypes from './entityTypes'
import useTheme from '../styling/useTheme'
import {
  useDirection,
  useOtherMode,
  // useLocalDate,
} from '../utility/appUtilities'

import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import RoomIcon from '@material-ui/icons/Room'
import TableIcon from '@material-ui/icons/TableChartOutlined'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'

export const EntityDetails = ({ entity: { type, data } }) => {
  const { tags: tagsShown } = useSelector(store => store.app.view)
  const direction = useDirection()
  const { mode } = useSelector(store => store.app)
  const otherMode = useOtherMode()
  const theme = useTheme({ mode: otherMode, direction })
  const dispatch = useDispatch(0)

  const { icon, color } = entityTypes[type]
  const { id, subTypes, word } = data

  // ToDo: pills' cancel icon ('x') will eventually enable to remove sub-types
  const handleDelete = () => {}

  const useStyles = makeStyles(theme => ({
    icon: {
      color: 'rgba(0, 0, 0, 0.4)',
    },
    label: {
      color: 'rgba(0, 0, 0, 0.6)',
    },
    deleteIcon: {
      color: 'rgba(0, 0, 0, 0.4)',
    },
    title: {
      color: `${color} !important`,
      fontWeight: '500',
      textTransform: 'uppercase',
      fontStretch: 'extra-expanded',
    },
    content: {
      display: 'flex',
      flexDirection: 'column-reverse',
    },
    subheader: {
      color: 'white',
      fontSize: '1.5rem',
    },
  }))

  const classes = useStyles()

  const styles = {
    root: {
      backgroundColor: 'transparent !important',
      minWidth: '15rem',
    },
    entityType: {
      backgroundColor: `${color} !important`,
    },
    avatar: {
      backgroundColor: `${color} !important`,
      color: 'rgba(0, 0, 0, 1)',
    },
    details: {
      fontWeight: '100',
      fontSize: '0.8rem',
      textAlign: 'center',
    },
    divider: {
      backgroundColor: `${color} !important`,
    },
    subTypes: {
      padding: '1rem',
      '& > div': {
        margin: '0 0.5rem',
      },
    },
    explainer: {
      height: '8rem',
      backgroundColor: 'rgba(256, 256, 256, 0.1)',
      marginTop: '1rem',
    },
    modeColor: {
      color: mode === 'dark' ? 'white !important' : 'inherit',
    },
  }

  const showRelationsOf = id => () => {
    dispatch(selected(id))
    dispatch(view({ exclusiveRelations: true }))
  }

  const markSelected = id => () => {
    dispatch(selected(id))
  }

  const { title, content, subheader } = classes

  return (
    <ThemeProvider theme={theme}>
      <Card elevation={0} css={styles.root}>
        <CardHeader
          avatar={<Avatar css={styles.avatar}>{icon}</Avatar>}
          title={type}
          subheader={word}
          classes={{ title, content, subheader }}
        />
        <Divider css={styles.divider} />
        <div css={styles.subTypes}>
          {subTypes &&
            subTypes.map(
              subType =>
                subType && (
                  <Chip
                    size="small"
                    label={subType}
                    css={styles.entityType}
                    onDelete={handleDelete}
                    key={subType}
                    classes={{
                      icon: classes.icon,
                      label: classes.label,
                      deleteIcon: classes.deleteIcon,
                    }}
                  />
                )
            )}
        </div>
        <CardContent>
          <Divider css={styles.modeColor}>Explainer</Divider>
          <div css={styles.explainer}></div>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            onClick={showRelationsOf(id)}
            disabled={!tagsShown}
            css={styles.modeColor}
          >
            <AccountTreeIcon />
          </IconButton>
          <IconButton onClick={markSelected(id)} css={styles.modeColor}>
            <RoomIcon />
          </IconButton>
          <IconButton css={styles.modeColor}>
            <TableIcon />
          </IconButton>
        </CardActions>
      </Card>
    </ThemeProvider>
  )
}

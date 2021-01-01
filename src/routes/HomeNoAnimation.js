/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleDrawer, toggleLocale, toggleMode } from '../redux/app'
import { useDirection } from '../utility/appUtilities'

import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'

import Open from '@material-ui/icons/FolderOpenOutlined'
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined'
import SwitchRightOutlinedIcon from '@material-ui/icons/SwitchRightOutlined'
import DarkModeOutlinedIcon from '@material-ui/icons/DarkModeOutlined'
import LightModeOutlinedIcon from '@material-ui/icons/LightModeOutlined'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import { FormattedMessage } from 'react-intl'

import Page from '../layout/Page'
import Dashboard from './Dashboard'
import Locations from './Locations'

const Home = () => {
  const { url } = useRouteMatch()
  const dispatch = useDispatch()
  const open = useSelector(store => store.app.drawerOpen)
  const direction = useDirection()
  const { mode } = useSelector(store => store.app)
  const [dir, setDir] = useState(direction)
  const rtl = dir === 'rtl'
  const ltr = dir === 'ltr'

  const drawerWidth = {}
  const routeWidth = {}
  drawerWidth.open = '12%'
  routeWidth.open = '88%'
  const menuItem = { padding: 1, icon: 1.5 }
  drawerWidth.close = `calc(2*${menuItem.padding}rem + ${menuItem.icon}rem)`
  routeWidth.close = `calc(100vw - (2*${menuItem.padding}rem + ${menuItem.icon}rem))`

  const styles = {
    root: {
      display: 'flex',
    },
    drawer: {
      width: open ? drawerWidth.open : drawerWidth.close,
      transition: 'width 0.5s',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    link: {
      textDecoration: 'none',
    },
    chevronItem: theme => ({
      display: 'flex',
      justifyContent: open ? 'flex-end' : 'center',
      borderRadius: '0',
      padding: '0',
      marginLeft: rtl ? 'inherit' : open ? '0' : '-0.5rem',
      marginRight: ltr ? 'inherit' : open ? '0' : '-0.5rem',
      '& svg': {
        fontSize: '2rem !important',
        transform: `rotate(${(open && ltr) || (!open && rtl) ? 0 : 180}deg)`,
        transition: 'transform 0.5s',
        color: theme.palette.grey['A700'],
      },
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        '& svg': {
          color: 'white',
        },
      },
    }),
    iconWrapper: theme => ({
      display: 'flex',
      padding: `${menuItem.padding}rem`,
      '& svg': {
        fontSize: `${menuItem.icon}rem`,
        color: theme.palette.grey['A700'],
      },
      '& svg[data-testid="SwitchRightOutlinedIcon"]': {
        transform: `rotate(${dir === 'rtl' ? 180 : 0}deg)`,
        transition: 'transform 0.5s',
      },
    }),
    drawerItem: theme => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: '0',
      padding: '0',
      color: theme.palette.grey['A700'],
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        '& svg': {
          color: 'white',
        },
      },
    }),
    title: {
      margin: '0 2px',
      fontSize: direction === 'rtl' ? '1.2rem' : 'inherit',
    },
    route: {
      width: open ? routeWidth.open : routeWidth.close,
      transition: 'width 1s',
      zIndex: '0',
      '& > div': {
        height: '100%',
      },
    },
  }

  const menu = [
    {
      id: 'open',
      icon: <Open />,
      onClick: () => {},
    },
    {
      id: 'locations',
      path: 'locations',
      component: <Locations />,
      icon: <ChatOutlinedIcon />,
    },
    {
      id: 'dashboard',
      path: 'dashboard',
      component: <Dashboard />,
      icon: <DashboardOutlinedIcon />,
    },
    {
      id: 'lang',
      icon: <SwitchRightOutlinedIcon />,
      onClick: () => {
        setDir(dir => (dir === 'ltr' ? 'rtl' : 'ltr'))
        setTimeout(() => dispatch(toggleLocale()), 0)
      },
    },
    {
      id: 'mode',
      icon:
        mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />,
      onClick: () => dispatch(toggleMode()),
    },
  ]

  const MenuItem = ({ id, icon, onClick }) => (
    <Button fullWidth css={styles.drawerItem} key={id} onClick={onClick}>
      <div css={styles.iconWrapper}>{icon}</div>
      <div css={styles.title}>
        <FormattedMessage id={id} />
      </div>
    </Button>
  )

  return (
    <Page css={styles.root}>
      <div css={styles.drawer}>
        <nav>
          <Button
            fullWidth
            css={styles.chevronItem}
            onClick={() => dispatch(toggleDrawer())}
          >
            <div css={styles.iconWrapper}>
              <ChevronLeftIcon />
            </div>
          </Button>
          {menu.map(({ id, path, icon, onClick }) =>
            path ? (
              <Link to={`${url}/${path}`} css={styles.link} key={id}>
                <MenuItem {...{ id, icon }} />
              </Link>
            ) : (
              <MenuItem {...{ id, icon, onClick }} key={id} />
            )
          )}
        </nav>
      </div>

      <Divider orientation="vertical" />

      <div css={styles.route}>
        <Switch>
          {menu
            .filter(({ path }) => path)
            .map(({ path, component }) => (
              <Route path={`${url}/${path}`} key={path}>
                {component}
              </Route>
            ))}
        </Switch>
      </div>
    </Page>
  )
}

export default Home

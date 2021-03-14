/** @jsxImportSource @emotion/react */
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleDrawer, toggleLocale, toggleMode } from '../redux/app'
import { logout } from '../redux/users'
import { useDirection } from '../utility/appUtilities'

import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'

import Folder from '@material-ui/icons/FolderOpenOutlined'
import ScheduleIcon from '@material-ui/icons/Schedule'
import SwitchRightOutlinedIcon from '@material-ui/icons/SwitchRightOutlined'
import DarkModeOutlinedIcon from '@material-ui/icons/DarkModeOutlined'
import LightModeOutlinedIcon from '@material-ui/icons/LightModeOutlined'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Logout from '@material-ui/icons/PowerSettingsNewOutlined'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

import useTranslation from '../i18n/useTranslation'

import Page from '../layout/Page'
import File from './File'
import Schedule from '../schedule/Schedule'
import Dashboard from './Dashboard'

const Home = () => {
  const { url } = useRouteMatch()
  const dispatch = useDispatch()
  const open = useSelector(store => store.app.drawerOpen)
  const direction = useDirection()
  const { mode } = useSelector(store => store.app)
  const [dir, setDir] = useState(direction)
  const rtl = dir === 'rtl'
  const ltr = dir === 'ltr'
  const t = useTranslation()

  const drawerWidth = {}
  const routeWidth = {}
  drawerWidth.open = '12%'
  routeWidth.open = '88%'
  const menuItem = { padding: 1, icon: 1.5 }
  drawerWidth.close = `calc(2*${menuItem.padding}rem + ${menuItem.icon}rem)`
  routeWidth.close = `calc(100vw - (2*${menuItem.padding}rem + ${menuItem.icon}rem))`

  const greyShade = '600'

  const styles = {
    root: {
      display: 'flex',
    },
    drawer: {
      width: open ? drawerWidth.open : drawerWidth.close,
      transition: 'width 0.5s',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
        color: theme.palette.grey[greyShade],
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
        color: theme.palette.grey[greyShade],
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
      color: theme.palette.grey[greyShade],
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

  const routes = [
    {
      path: 'file',
      component: <File />,
      icon: <Folder />,
      title: t('file'),
    },
    {
      path: 'schedule',
      component: <Schedule />,
      icon: <ScheduleIcon />,
      title: t('schedule'),
    },
    {
      path: 'dashboard',
      component: <Dashboard />,
      icon: <DashboardOutlinedIcon />,
      title: t('dashboard'),
    },
  ]
  const toggles = [
    {
      key: 'lang',
      title: 'Language',
      icon: <SwitchRightOutlinedIcon />,
      onClick: () => {
        setDir(dir => (dir === 'ltr' ? 'rtl' : 'ltr'))
        setTimeout(() => dispatch(toggleLocale()), 500)
      },
      title: t('lang'),
    },
    {
      key: 'mode',
      title: 'Mode',
      icon:
        mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />,
      onClick: () => dispatch(toggleMode()),
      title: t('mode'),
    },
    {
      key: 'logout',
      icon: <Logout />,
      onClick: () => dispatch(logout()),
      title: t('logout'),
    },
  ]

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
          {routes.map(({ path, title, icon }) => (
            <Link to={`${url}/${path}`} css={styles.link} key={path}>
              <Button fullWidth css={styles.drawerItem} title={title}>
                <div css={styles.iconWrapper}>{icon}</div>
                <div css={styles.title}>{title}</div>
              </Button>
            </Link>
          ))}
          {toggles.map(({ key, title, icon, onClick }) => (
            <Button
              fullWidth
              css={styles.drawerItem}
              {...{ key, onClick, title }}
            >
              <div css={styles.iconWrapper}>{icon}</div>
              <div css={styles.title}>{title}</div>
            </Button>
          ))}
        </nav>
      </div>
      <Divider orientation="vertical" />
      <div css={styles.route}>
        <Switch>
          {routes.map(({ path, component }) => (
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

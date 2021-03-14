import { Redirect, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../redux/users'

import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import useTranslation from '../i18n/useTranslation'

import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import ScheduleIcon from '@material-ui/icons/Schedule'

const useStyles = makeStyles(theme => ({
  container: {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    padding: '10vw',
  },
  logo: {
    '& > svg': {
      fontSize: '8rem',
    },
  },
  name: {
    fontWeight: '100',
    textTransform: 'lowercase',
    fontSize: '2rem',
    letterSpacing: '0.8rem',
  },
  formContainerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '1rem',
  },
  form: {
    maxWidth: '500px',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function Login() {
  const loggedIn = useSelector(store => !!store.users.loggedIn.username)
  const dispatch = useDispatch()
  const classes = useStyles()
  const { register, handleSubmit, errors } = useForm()
  const { state } = useLocation()
  const t = useTranslation()

  const onSubmit = ({ username, password }) => {
    dispatch(fetchUser({ username, password }))
  }

  if (loggedIn) {
    return <Redirect to={state?.from || '/'} />
  }

  return (
    <div className={classes.container}>
      <div className={classes.hero}>
        <div className={classes.logo}>
          <ScheduleIcon />
        </div>
        <Typography variant="h3" className={classes.name}>
          Schedule
        </Typography>
      </div>

      <div className={classes.formContainerContainer}>
        <div className={classes.formContainer}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            <FormattedMessage id="signIn" />
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
            noValidate
            autoComplete="off"
          >
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              id="username"
              label={t('username')}
              name="username"
              autoComplete="username"
              autoFocus
              inputRef={register({ required: true })}
              error={!!errors.username}
              helperText={errors.username && t('usernameRequired')}
            />
            <TextField
              variant="standard"
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('password')}
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={register({ required: true })}
              error={!!errors.password}
              helperText={errors.password && t('passwordRequired')}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={t('rememberMe')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              <FormattedMessage id="signIn" />
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  <FormattedMessage id="forgotPassword" />
                </Link>
              </Grid>
              <Grid item>
                <Link disabled href="#" variant="body2">
                  <FormattedMessage id="signUp" />
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </div>
  )
}

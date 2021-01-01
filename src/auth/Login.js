import { Redirect, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../redux/users'

import { useForm } from 'react-hook-form'

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
import cards from '../assets/illustration_cards_c.png'

const useStyles = makeStyles(theme => ({
  container: {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    padding: '10vw',
  },
  logo: {
    height: '30vh',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10vw',
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

  const onSubmit = ({ username, password }) => {
    dispatch(fetchUser({ username, password }))
  }

  if (loggedIn) {
    return <Redirect to={state?.from || '/'} />
  }

  return (
    <div className={classes.container}>
      <div className={classes.hero}>
        <img className={classes.logo} src={cards} alt="cards" />
        <Typography variant="h3">Puzzle</Typography>
      </div>

      <div className={classes.formContainer}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
            label="User name"
            name="username"
            autoComplete="username"
            autoFocus
            inputRef={register({ required: true })}
            error={!!errors.username}
            helperText={errors.username && 'User name is required'}
          />
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register({ required: true })}
            error={!!errors.password}
            helperText={errors.password && 'Password is required'}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  )
}

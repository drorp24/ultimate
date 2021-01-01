import { useState } from 'react'
import useNotifications from './useNotifications'

import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/core/Alert'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  snackbar: {
    width: '100%',
    justifyContent: 'center',
  },
}))

const Snack = () => {
  const [open, setOpen] = useState(false)
  const { message, severity } = useNotifications(setOpen)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const classes = useStyles()

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      onClose={handleClose}
      autoHideDuration={5000}
      className={classes.snackbar}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={handleClose}
        className={classes.alert}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Snack

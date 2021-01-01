import { useMemo } from 'react'
import { createMuiTheme } from '@material-ui/core/styles'

const useTheme = ({ mode, direction }) =>
  useMemo(
    () =>
      createMuiTheme({
        direction,
        palette: {
          mode,
        },
      }),
    [mode, direction]
  )

export default useTheme

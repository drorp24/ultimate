import { useMemo } from 'react'

const usePixels = rem =>
  useMemo(
    () => rem * parseFloat(getComputedStyle(document.documentElement).fontSize),
    [rem]
  )

export default usePixels

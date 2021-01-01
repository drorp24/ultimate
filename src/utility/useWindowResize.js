import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setDimensions } from '../redux/app'
import { debounce } from '../utility/debounce'

const useWindowResize = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    function handleResize() {
      dispatch(
        setDimensions({
          height: window.innerHeight,
          width: window.innerWidth,
        })
      )
    }
    // ToDo: try replacing debounce with requestAnimationFrame
    window.addEventListener('resize', debounce(handleResize, 300))
    return () => {
      window.removeEventListener('resize', debounce(handleResize, 300))
    }
  }, [dispatch])
}

export default useWindowResize

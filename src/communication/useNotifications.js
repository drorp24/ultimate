import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const useNotifications = setOpen => {
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('')

  const userError = useSelector(store => store.users.error)
  const fileError = useSelector(store => store.content.error)
  const contentError = useSelector(store => store.content.error === 'content')

  useEffect(() => {
    if (userError) {
      setOpen(true)
      setMessage(userError || 'Something went wrong')
      setSeverity('error')
    }
    if (contentError) {
      setOpen(true)
      setMessage(
        "There are issues with the file's content. Check log for more details"
      )
      setSeverity('error')
    }
    if (fileError && !contentError) {
      setOpen(true)
      setMessage(contentError || 'Something went wrong')
      setSeverity('error')
    }
  }, [setOpen, userError, contentError, fileError])

  return { message, severity }
}

export default useNotifications

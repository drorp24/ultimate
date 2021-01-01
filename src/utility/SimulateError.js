import { useEffect } from 'react'

export default function SimulateError() {
  useEffect(() => {
    throw new Error('Simulated Error')
  })
  return null
}

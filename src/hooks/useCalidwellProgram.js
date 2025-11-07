import { useEffect, useState } from 'react'

import { fetchCalidwellProgram } from '../services/sheetImporter'

export function useCalidwellProgram() {
  const [job, setJob] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      setError(null)
      try {
        const program = await fetchCalidwellProgram()
        if (isMounted) {
          setJob(program)
          setStatus('success')
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error')
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  return { job, status, error }
}



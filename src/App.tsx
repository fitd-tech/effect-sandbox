import { useState, useMemo, useCallback } from 'react'
import { Effect } from 'effect'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import effectLogo from './assets/effect.svg'

import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [failError, setFailError] = useState<string | null>(null)
  console.log('failError', failError)

  const task = useMemo(
    () => Effect.sync(() => setCount((current) => current + 1)),
    [setCount]
  )

  const succeed = useMemo(() => Effect.sync(() => {
    const success = Effect.runSync(Effect.succeed(true))
    setFailError(null)
    setSuccess(success)
  }), [])

  const fail = useMemo(() => Effect.sync(() => {
    const failureExit = Effect.runSyncExit(Effect.fail(new Error('Failed!')))
    console.log('failureExit', failureExit)
    setSuccess(null)
    if ('cause' in failureExit && 'error' in failureExit.cause && 'message' in failureExit.cause.error) {
      setFailError(failureExit.cause.error.message as string)
    }
  }), [])

  const handleClickIncrement = useCallback(() => Effect.runSync(task), [task])

  const handleClickSucceeed = useCallback(() => Effect.runSync(succeed), [succeed])
  const handleClickFail = useCallback(() => Effect.runSync(fail), [fail])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="effect-logo-wrapper">
      <a href="https://effect.website" target="_blank">
        <img src={effectLogo} className="logo effect" alt="Effect logo" />
      </a>
      </div>
      <h2>with Effect!</h2>
      <div className="top-spacing">
        <h3>Getting Started</h3>
      </div>
      <h4>Installation</h4>
      <div className="card">
        <button onClick={handleClickIncrement}>count is {count}</button>
      </div>
      <h4>Creating Effects</h4>
      <div className="card flex col">
        <div
        >
          {success !== null && (
            <div>Succeeded!</div>
          )}
          {failError !== null && (
            <div>{failError}</div>
          )}
        </div>
        <div
          style={{ display: 'inline-block' }}
        >
          <button onClick={handleClickSucceeed}>Effect.succeed</button>
        </div>
        <div
          style={{
            display: 'inline-block'
          }}
        >
          <button onClick={handleClickFail}>Effect.fail</button>
        </div>
      </div>
    </>
  )
}

export default App

import { useState, useMemo, useCallback } from 'react'
import { Cause, Data, Effect, Exit } from 'effect'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import effectLogo from './assets/effect.svg'

import './App.css'

class IntentionalFailure extends Data.Error<{ message: string }> {}

function App() {
  const [count, setCount] = useState(0)

  const [success, setSuccess] = useState<boolean | null>(null)
  const [failError, setFailError] = useState<string | null>(null)

  function handleClickClearSuccessAndFailure() {
    setSuccess(null)
    setFailError(null)
  }

  // GETTING STARTED
  // Installation
  const installationChapterLink = 'https://effect.website/docs/getting-started/installation/'

  const task = useMemo(
    () => Effect.sync(() => setCount((current) => current + 1)),
    [setCount]
  )

  const handleClickIncrement = useCallback(() => Effect.runSync(task), [task])

  // Creating Effects
  const creatingEffectsChapterLink = 'https://effect.website/docs/getting-started/creating-effects/'
  // Running Effects
  const runningEffectsChapterLink = 'https://effect.website/docs/getting-started/running-effects/'

  const succeed = useMemo(() => Effect.sync(() => {
    const success = Effect.runSync(Effect.succeed(true))
    setFailError(null)
    setSuccess(success)
  }), [])

  const failNaive = useMemo(() => Effect.sync(() => {
    const failureExit = Effect.runSyncExit(Effect.fail(new Error('Failed!')))
    setSuccess(null)
    if ('cause' in failureExit && 'error' in failureExit.cause && 'message' in failureExit.cause.error) {
      setFailError(failureExit.cause.error.message as string)
    }
  }), [])

  const failMatch = useMemo(() => Effect.sync(() => {
    const failureExit = Effect.runSyncExit(Effect.fail(new Error('Failed!')))
    setSuccess(null)
    Exit.match(failureExit, {
      onSuccess: value => console.log('unreachable value from failMatch', value),
      onFailure: cause => setFailError(Cause.pretty(cause))
    })
  }), [])

  const failCustomError = useMemo(() => Effect.sync(() => {
    const failureEffect = Effect.fail(new IntentionalFailure({ message: 'Meant to do that!' }))
    setSuccess(null)
    const match = Effect.matchCause(failureEffect, {
      onSuccess: value => console.log('unreachable value from failCustomError', value),
      onFailure: cause => {
        if (cause._tag === 'Fail') {
          setFailError(cause.error.message)
        }
      }
    })
    Effect.runSync(match)
  }), [])

  const handleClickSucceeed = useCallback(() => Effect.runSync(succeed), [succeed])
  const handleClickFailNaive = useCallback(() => Effect.runSync(failNaive), [failNaive])
  const handleClickFailMatch = useCallback(() => Effect.runSync(failMatch), [failMatch])
  const handleClickFailCustomError = useCallback(() => Effect.runSync(failCustomError), [failCustomError])

  return (
    <div style={{marginBottom: '300px'}}>
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
      <h4>Installation [ <a href={installationChapterLink}>Link</a> ]</h4>
      <div className="card">
        <button onClick={handleClickIncrement}>count is {count}</button>
      </div>
      <h4>Creating Effects [ <a href={creatingEffectsChapterLink}>Link</a> ]</h4>
      <h4>Running Effects [ <a href={runningEffectsChapterLink}>Link</a> ]</h4>
      <div className="card flex col">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50px',
            backgroundColor: 'rgb(36, 39, 47)',
            borderRadius: '5px',
            padding: '0 15px'
          }}
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
          <button onClick={handleClickClearSuccessAndFailure}>Clear status</button>
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
          <button onClick={handleClickFailNaive}>Effect.fail (naive object access)</button>
        </div>
        <div
          style={{
            display: 'inline-block'
          }}
        >
          <button onClick={handleClickFailMatch}>Effect.fail (Effect.match and Cause.pretty)</button>
        </div>
        <div
          style={{
            display: 'inline-block'
          }}
        >
          <button onClick={handleClickFailCustomError}>Effect.fail (custom error and Effect.matchCause)</button>
        </div>
      </div>
    </div>
  )
}

export default App

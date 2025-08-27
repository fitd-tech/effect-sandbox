import { useState, useMemo, useCallback } from 'react'
import { Effect } from 'effect'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import effectLogo from './assets/effect.svg'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const task = useMemo(
    () => Effect.sync(() => setCount((current) => current + 1)),
    [setCount]
  )

  const increment = useCallback(() => Effect.runSync(task), [task])

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
      <div className="card">
        <button onClick={increment}>count is {count}</button>
      </div>
    </>
  )
}

export default App

import { useState } from 'react'
import { Link } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
        React + Tailwind
      </h1>
      <button
        type="button"
        className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count}
      </button>
      <Link to="/editor" className="text-purple-600 underline hover:text-purple-700">
        Open Studio Editor
      </Link>
    </div>
  )
}

export default App

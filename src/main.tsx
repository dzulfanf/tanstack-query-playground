import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-white p-8">
      <p className="text-2xl font-bold text-blue-500">TanStack Query Playground</p>
    </div>
  </StrictMode>,
)

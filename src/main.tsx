import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Editor from './pages/Editor'
import { TooltipProvider } from './components/ui/tooltip'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
)

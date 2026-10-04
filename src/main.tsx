import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@qpokychuk/sf-pro-display/index.css'
import './index.css'
import './workspace.css'
import './design-system.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

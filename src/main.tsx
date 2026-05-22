import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GlobalDashboardView } from './view/Dashboard.view'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalDashboardView />
  </StrictMode>
)

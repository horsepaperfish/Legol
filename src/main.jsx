import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Timeline from './components/Timeline.jsx'
import Chat from './components/Chat.jsx'
import Resources from './components/Resources.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

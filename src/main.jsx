import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import App from './App.jsx'
import Timeline from './components/Timeline.jsx'
import Chat from './components/Chat.jsx'
import Resources from './components/Resources.jsx'
import Login from './components/Login.jsx'
import Flowchart from './components/Flowchart.jsx'
import { ChatProvider } from './context/ChatContext.jsx'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } }
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><App /></motion.div>} />
        <Route path="/chat" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Chat /></motion.div>} />
        <Route path="/timeline" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Timeline /></motion.div>} />
        <Route path="/resources" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Resources /></motion.div>} />
        <Route path="/login" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Login /></motion.div>} />
        <Route path="/flowchart" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Flowchart /></motion.div>} />
      </Routes>
    </AnimatePresence>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ChatProvider>
  </StrictMode>,
)

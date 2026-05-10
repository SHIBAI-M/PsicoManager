import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Login from './pages/login.jsx'
import Home from './pages/home.jsx'
import Cadastro from './pages/cadastro.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Cadastro/>}/>
        <Route path="/login" element={<Login/>}/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App

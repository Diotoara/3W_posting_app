import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Auth from './pages/Auth'

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/auth' element={<Auth/>} />
      <Route path="*" element={<Home />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Navbar from './components/Navbar'

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      setUser({ username: storedProfile, _id: localStorage.getItem("userId") });
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Navbar is now INSIDE BrowserRouter, so Link and useNavigate will work */}
        <Navbar user={user} setUser={setUser} />
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Auth />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
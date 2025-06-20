import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerified from './pages/EmailVerified'
import ResetPassword from './pages/ResetPassword'
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext'

const App = () => {
  const { loading } = useAppContext()

  if (loading) return <div className="text-center mt-10">Checking authentication...</div>

  return (
    <div>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerified />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}

export default App

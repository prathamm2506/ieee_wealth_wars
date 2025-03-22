import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import UserPage from './pages/userpage/UserPage'
import Dashboaord from './pages/dashboard/Dashboaord'

const routes = (
  <Router>
    <Routes>
      <Route path='/login' exact element={<Login/>}/>
      <Route path='/signup' exact element={<SignUp/>}/>
      <Route path='/user' exact element={<UserPage/>}/>
      <Route path='/dashboard' exact element={<Dashboaord/>}/>
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
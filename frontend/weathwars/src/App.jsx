import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import UserPage from './pages/userpage/UserPage'
import Dashboaord from './pages/dashboard/Dashboaord'
import Master from './pages/master/Master'

const routes = (
  <Router>
    <Routes>
      <Route path='/login' exact element={<Login/>}/>
      <Route path='/signup' exact element={<SignUp/>}/>
      <Route path='/user' exact element={<UserPage/>}/>
      <Route path='/dashboard' exact element={<Dashboaord/>}/>
      <Route path='/master' exact element={<Master/>}/>
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>
      {routes}
      <h1>hi</h1>
    </div>
  )
}

export default App
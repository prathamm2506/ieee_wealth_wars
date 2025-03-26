import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'
import UserPage from './pages/userpage/UserPage'
import Dashboaord from './pages/dashboard/Dashboaord'
import Master from './pages/master/Master'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' exact element={<SignUp />} />
          <Route path='/loginf' exact element={<Login />} />
          <Route path='/signupf' exact element={<SignUp />} />
          <Route path='/userf' exact element={<UserPage />} />
          <Route path='/dashboardforthecouncilonlyf' exact element={<Dashboaord />} />
          <Route path='/masterforthemasteronlyf' exact element={<Master />} />
        </Routes>
        {/* <h1>hi</h1> */}
        {/* <Link to='/login'>Login</Link> */}
      </div>
    </Router>
  )
}

export default App

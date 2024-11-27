import React from 'react'
import { Routes, Route, Router } from "react-router-dom";
// import Logsign from './logsign';
import Login from './login'
import Signup from './signup'
import Home from './home';
import Wel_emp from './wel_emp';
import Coordinator from './coordinator';
import Report from './report'


function App() {
  return (
    <>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/welcome' element={<Wel_emp />} />
        <Route path='/admin/*' element={<Coordinator />} />
        <Route path='/report' element={<Report />} />
      </Routes>
      
    </>
  )
}

export default App
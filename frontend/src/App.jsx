import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home1 from './pages/Home1'
import Login1 from './pages/Login1'
import Contact1 from './pages/Contact1'
import Cancellation1 from './pages/Cancellation1'
import Myticket1 from './pages/Myticket1'
import Profile1 from './pages/Profile1'
import Navbar from './componenets/Navbar'
import Footer from './componenets/Footer'
import About1 from './pages/About1'
import Request1 from './pages/Request1'
import Viewticket1 from './pages/Viewticket1'
import Warden1 from './pages/Warden1'
import LoginPage from './pages/loginpage'
import CreateAccount from './pages/createacct'
import Hod1 from './pages/Hod1'


//import MovementRequest from './pages/Request1';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home1 />} />
        <Route path='/login' element={<Login1 />} />
        <Route path='/about' element={<About1 />} />
        <Route path='/cancellation' element={<Cancellation1/>} />
        <Route path='/ticket' element={<Myticket1/>} />
        <Route path='/myprofile' element={<Profile1 />} />
        <Route path='/contact' element={<Contact1 />} />
        <Route path='/request1' element={<Request1 />} />
        <Route path='/viewticket1' element={<Viewticket1 />} />
        <Route path='/warden' element={<Warden1 />} />
        <Route path='/loginpage' element={<LoginPage/>} />
        <Route path='/createacct' element={<CreateAccount/>} />
        <Route path='/Hod1' element={<Hod1/>} />



      </Routes>
      <Footer />
      
    </div>
  )
}

export default App
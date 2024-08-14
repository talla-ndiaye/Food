import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Navbar from './components/Navbar/Navbar'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/Home'
import Myorders from './pages/Myorders/Myorders'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Reset from './pages/Reset/Reset'
import Verify from './pages/Verify/Verify'

const App = () => {

  const url = "http://localhost:4000"

  const [showLogin, setShowLogin] = useState (false);
  const [showReceipt, setShowReceipt] = useState(false);


  return (

    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}
    {showReceipt ? <ReceiptPopup setShowReceipt={setShowReceipt} /> : <></> }

     <div className='app'>

     <ToastContainer />

      <Navbar url={url} setShowLogin={setShowLogin}/>

        <Routes>

          <Route path='/' element={<Home url={url}/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/order' element={<PlaceOrder/>} />
          <Route path='/verify' element={<Verify/>} />
          <Route path="/Myorders" element={<Myorders url={url} setShowReceipt={setShowReceipt} />}
          />
          
          <Route path='/reset-password' element={<Reset url={url} />} />


        </Routes>

    </div>

    <Footer />
    
    </>
   
  )
}

export default App

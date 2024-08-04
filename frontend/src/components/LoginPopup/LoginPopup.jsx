import React, { useState } from 'react'

import { assets } from '../../assets/assets'
import './LoginPopup.css'

const LoginPopup = ({setShowLogin}) => {

    const [currState,setCurrState] = useState("Login")
  return (
    <div className='login-popup'>
        <form action="" className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>

            <div className="login-popup-inputs">
                {currState==="Login"?<></>: <input type="text" placeholder='Your name' required/>}
                
                <input type="email" placeholder='Your email' required />
                <input type="password" placeholder='Your password' />
            </div>
            <button>{currState==="Sign Up"?"create account":"Login"}</button>
            <div className="login-popup-conditions">
                <input type="checkbox" required />
                <p>By Continuing, I agre to the terms of use & privacy policy</p>
            </div>
            {currState==="Login"
            ?<p>Create account <span onClick={()=>setCurrState("Sign Up")}>click here</span></p>
            :<p>Already have account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>}
            

        </form>
      
    </div>
  )
}

export default LoginPopup

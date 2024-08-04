import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './PlaceOrder.css'

const PlaceOrder = () => {

  const { getTotalCartAmout } = useContext(StoreContext)
  return (
    <form className='place-order'>

      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" placeholder='First name' />

          <input type="text" placeholder='Last NAme' />
        </div>

        <input type="email" placeholder='Email' />
        <input type="text" placeholder='Street' />

        <div className="multi-fields">
          <input type="text" placeholder='City ' />

          <input type="text" placeholder='State' />
        </div>

        <div className="multi-fields">
          <input type="text" placeholder='zip Code' />

          <input type="text" placeholder='Country' />
        </div>

        <input type="text" placeholder='phone' />

      </div>



      <div className="place-order-right">
        <div className="cart-total">

          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmout()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>${getTotalCartAmout() === 0 ? 0 : 2}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmout() === 0 ? 0 : getTotalCartAmout() + 2}</b>
            </div>

          </div>

          <button >PROCED TO Payment</button>

        </div>


      </div>

    </form>
  )
}

export default PlaceOrder

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmout, url } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Nom</p>
          <p>Prix</p>
          <p>Quantité</p>
          <p>Total</p>
          <p>Supprimer</p>
        </div>
        <br />
        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id} className="cart-items-title cart-items-item">
                <img src={`${url}/images/${item.image}`} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.price} Fcfa</p>
                <p>{cartItems[item._id]}</p>
                <p>{item.price * cartItems[item._id]} Fcfa</p>
                <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                <hr />
              </div>
            );
          }
          return null; // Ajouter un return pour les éléments qui ne répondent pas à la condition
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Total du Panier</h2>
          <div>
            <div className="cart-total-details">
              <p>Sous-total</p>
              <p>{getTotalCartAmout()} Fcfa</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Frais de livraison</p>
              <p>{getTotalCartAmout() === 0 ? 0 : 1000} Fcfa</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmout() === 0 ? 0 : getTotalCartAmout() + 1000} Fcfa</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>Valider le Panier</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Si vous avez un code promo, mettez le ici</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='Code Promo' />
              <button>Soumettre</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

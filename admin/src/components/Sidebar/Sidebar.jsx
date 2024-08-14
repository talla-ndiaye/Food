import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import './Sidebar.css'
const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/add' className="sidebar-option">
                <img src={assets.add_icon} alt="" />
                <p>Ajouter un article</p>
            </NavLink>
            <NavLink to ="/list" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Liste des articles</p>
            </NavLink>
            <NavLink to="/orders" className="sidebar-option">
                <img src={assets.order_icon} alt="" />
                <p>Liste des commandes</p>
            </NavLink>
            <NavLink to='/users' className="sidebar-option">
                <img src={assets.add_icon} alt="" />
                <p>Liste des utilisateurs</p>
            </NavLink>
        </div>
      
    </div>
  )
}
export default Sidebar

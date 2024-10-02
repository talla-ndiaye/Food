import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader'; // Importe le Loader
import LoginPopup from './components/LoginPopup/LoginPopup';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import Myorders from './pages/Myorders/Myorders';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Reset from './pages/Reset/Reset';
import Verify from './pages/Verify/Verify';

const App = () => {

  const url = "http://localhost:4000"; // URL de ton backend

  const [showLogin, setShowLogin] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState(null); // Statut du backend (fonctionne ou non)

  // Si le backend ne marche pas, afficher un message d'erreur
  useEffect(() => {
    if (backendStatus === false) {
      alert("Le backend est inaccessible. Veuillez vérifier votre serveur.");
    }
  }, [backendStatus]);

  return (
    <>
      {isLoading ? ( // Si isLoading est vrai, afficher le Loader
        <Loader backendUrl={url} setBackendStatus={setBackendStatus} setIsLoading={setIsLoading} />
      ) : (
        <>
          {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
          {showReceipt && <ReceiptPopup setShowReceipt={setShowReceipt} />}
          
          <div className='app'>
            <ToastContainer />
            <Navbar url={url} setShowLogin={setShowLogin} />

            <Routes>
              <Route path='/' element={<Home url={url} />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/order' element={<PlaceOrder />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/Myorders' element={<Myorders url={url} setShowReceipt={setShowReceipt} />} />
              <Route path='/reset-password' element={<Reset url={url} />} />
            </Routes>
          </div>
          
          <Footer />
        </>
      )}
    </>
  );
};

export default App;

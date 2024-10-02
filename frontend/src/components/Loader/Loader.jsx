import axios from 'axios'; // Pour faire la requête au backend
import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';

const Loader = ({ backendUrl, setBackendStatus, setIsLoading }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => (oldProgress >= 100 ? 100 : oldProgress + 10)); // Barre de progression
    }, 300);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Combiner le délai minimum de 5 secondes avec la requête backend
    const delayTimeout = new Promise(resolve => setTimeout(resolve, 5000)); // 5 secondes de délai

    const checkBackend = axios.get(backendUrl)
      .then(response => {
        setBackendStatus(true); // Backend est fonctionnel
      })
      .catch(error => {
        setBackendStatus(false); // Backend inaccessible
      });

    // Attendre que le backend et le délai de 5 secondes soient tous les deux terminés
    Promise.all([delayTimeout, checkBackend])
      .then(() => {
        setIsLoading(false); // Fin du chargement après 5 secondes et réponse du backend
      });

  }, [backendUrl, setBackendStatus, setIsLoading]);

  return (
    <div style={styles.loaderContainer}>
      <img src={assets.logo} alt="Logo" style={styles.logo} />
      <div style={styles.progressContainer}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
      </div>
      <p>Chargement en cours... {progress}%</p>
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: '150px',
    marginBottom: '20px',
  },
  progressContainer: {
    width: '70%',
    height: '10px',
    backgroundColor: '#ddd',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '15px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: '5px',
    transition: 'width 0.3s ease',
  },
};

export default Loader;
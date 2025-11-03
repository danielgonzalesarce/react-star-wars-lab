import React, { useEffect } from 'react';
import './App.css';
import CharacterLoader from './CharacterLoader';

function App() {
  // Cargar el sonido
  useEffect(() => {
    const audio = new Audio('/007132146_prev.mp3');
    audio.volume = 0.5; // Ajusta el volumen (0.0 a 1.0)
    audio.preload = 'auto';

    // Función para reproducir sonido al hacer click en cualquier botón
    const handleButtonClick = (event) => {
      // Verificar si el click fue en un botón
      const target = event.target;
      const isButton = target.tagName === 'BUTTON' || 
                       target.closest('button') !== null ||
                       target.tagName === 'A' && target.classList.contains('btn');
      
      if (isButton && !target.disabled) {
        // Reiniciar y reproducir el sonido
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.warn('Error al reproducir sonido:', error);
        });
      }
    };

    // Agregar event listener al documento
    document.addEventListener('click', handleButtonClick);

    // Limpiar el event listener al desmontar
    return () => {
      document.removeEventListener('click', handleButtonClick);
    };
  }, []);

  return (
    <div className="App">
      <CharacterLoader />
    </div>
  );
}

export default App;

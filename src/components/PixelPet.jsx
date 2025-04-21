import { useState, useEffect } from 'react';
import '../styles/PixelPet.css';

const PixelPet = () => {
  const [petState, setPetState] = useState(() => {
    const savedState = localStorage.getItem('pixelPetState');
    return savedState ? JSON.parse(savedState) : {
      hunger: 100,
      happiness: 100,
      energy: 100,
      sleeping: false,
      lastUpdate: Date.now()
    };
  });

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPetState(prevState => {
        const timePassed = (Date.now() - prevState.lastUpdate) / 1000;
        const newState = {
          ...prevState,
          hunger: Math.max(0, prevState.hunger - timePassed * 0.5),
          happiness: Math.max(0, prevState.happiness - timePassed * 0.3),
          energy: prevState.sleeping
            ? Math.min(100, prevState.energy + timePassed * 1)
            : Math.max(0, prevState.energy - timePassed * 0.4),
          lastUpdate: Date.now()
        };
        localStorage.setItem('pixelPetState', JSON.stringify(newState));
        return newState;
      });
    }, 1000);

    return () => clearInterval(gameLoop);
  }, []);

  const feed = () => {
    if (!petState.sleeping) {
      setPetState(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 30)
      }));
    }
  };

  const play = () => {
    if (!petState.sleeping && petState.energy > 20) {
      setPetState(prev => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 30),
        energy: Math.max(0, prev.energy - 20)
      }));
    }
  };

  const toggleSleep = () => {
    setPetState(prev => ({
      ...prev,
      sleeping: !prev.sleeping
    }));
  };

  const getPetMood = () => {
    const average = (petState.hunger + petState.happiness + petState.energy) / 3;
    if (petState.sleeping) return '😴';
    if (average < 30) return '😢';
    if (average < 60) return '😐';
    return '😊';
  };

  return (
    <div className="pixel-pet">
      <div className="pet-display">
        <div className="pet-sprite">{getPetMood()}</div>
        <div className="status-bars">
          <div className="status-bar">
            <span>Hunger:</span>
            <div className="bar-container">
              <div className="bar" style={{ width: `${petState.hunger}%` }} />
            </div>
          </div>
          <div className="status-bar">
            <span>Happiness:</span>
            <div className="bar-container">
              <div className="bar" style={{ width: `${petState.happiness}%` }} />
            </div>
          </div>
          <div className="status-bar">
            <span>Energy:</span>
            <div className="bar-container">
              <div className="bar" style={{ width: `${petState.energy}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div className="pet-controls">
        <button onClick={feed} disabled={petState.sleeping}>Feed</button>
        <button onClick={play} disabled={petState.sleeping || petState.energy <= 20}>Play</button>
        <button onClick={toggleSleep}>{petState.sleeping ? 'Wake Up' : 'Sleep'}</button>
      </div>
    </div>
  );
};

export default PixelPet;
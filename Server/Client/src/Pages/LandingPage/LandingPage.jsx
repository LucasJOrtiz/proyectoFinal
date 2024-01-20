import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './LandingPage.css';
import firstClic from '../../assets/firstClic.wav'
import secondClic from '../../assets/secondClic.wav'
import enterPageClic from '../../assets/secondClic.wav'


function LandingPage() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const audioRef = useRef(null);
  const secondAudioRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isBlack, setIsBlack] = useState(true);
  const [circleVisible, setCircleVisible] = useState(false);
  const [delayTimes] = useState([1000, 2000, 3000, 4000]);
  const circleTexts = ['About Me', 'Welcome', 'Create a Driver', 'Home'];

  const SoundClick = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.error('Sound error:', error);
        });
      }
    };

  const SecondSoundClick = () => {
    if (secondAudioRef.current) {
      secondAudioRef.current.play().catch((error) => {
        console.error('Second sound error:', error);
      });
      }
    };

  const headerStyle = {
      cursor: 'pointer',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: isBlack ? 'black' : '#2b395f3d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      padding: '20px 20px',
      textAlign: 'center',
      filter: 'drop-shadow(0 0 3em #646cffaa)',
      position: 'relative',
      zIndex: 1,
    };
  
  const circleStyles = [
      { width: '250px', 
      height: '250px', 
      backgroundColor: '#305cad67', 
      zIndex: -1 },

      { width: '350px', 
      height: '350px', 
      backgroundColor: '#2f529267', 
      zIndex: -2 },

      { width: '450px', 
      height: '450px', 
      backgroundColor: '#2a447467', 
      zIndex: -3 },
      
      { width: '600px', 
      height: '550px', 
      backgroundColor: '#0b0a1acb', 
      zIndex: -4 },
    ];
  
  const circleLinks = [
      '/aboutme', 
      '/Welcome', 
      '/form', 
      '/home', 
    ];
  
  const DelayedCircle = ({ style, delay, text }) => {
      const [visible, setVisible] = useState(false);

      useEffect(() => {
        const timer = setTimeout(() => {
          setVisible(true);
        }, delay);
        return () => clearTimeout(timer);
      }, [delay]);

      const circleTextStyle = {
        position: 'absolute',
        top: '20px',
        width: '100%',
        textAlign: 'center',
        color: '#ffffff',
        zIndex: 1,
      };

      return visible ? (
        <div 
        className="circle" 
        style={{ ...style, transform: 'scale(1)' }}>
          <span style={circleTextStyle}>{text}</span>
        </div>
      ) : null;
    };

  const renderCircles = menuOpen ? (
      <div className="circles">
        {circleStyles.map((style, index) => (
          <div className="circle-link" key={index}>
            <Link to={circleLinks[index]} className="circle">
              <DelayedCircle
                key={index}
                style={{
                  ...style,
                  transform: circleVisible ? 'scale(1)' : 'scale(0)',
                }}
                delay={delayTimes[index]}
                text={circleTexts[index]}
                onClick={() => handleCircleClick(index)}
              />
            </Link>
          </div>
        ))}
      </div>
    ) : null;

  const handleAllClicks = () => {
      setIsBlack(!isBlack);
      setMenuOpen(!menuOpen);
      setCircleVisible(!menuOpen);
      
      if (isBlack) { 
        SoundClick(); 
      }
      if (!isBlack) {
        SecondSoundClick();
        }
      };

  return (
    <div className="app-container" >
      {isLandingPage && ( 
        <header 
        className={`header ${menuOpen ? 'open' : ''}`} 
        style={headerStyle} 
        onClick={handleAllClicks}>
          <h1 className="title">PI Drivers</h1>
          <audio ref={audioRef} src={firstClic} />
          <audio ref={secondAudioRef} src={secondClic} />
        </header>
      )}
      {renderCircles}
    </div>
  );
}

export default LandingPage;
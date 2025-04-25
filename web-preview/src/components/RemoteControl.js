import React, { useState } from 'react';
import './RemoteControl.css';
import OneClickLayoutButton from './OneClickLayoutButton';

function RemoteControl({ device, onDisconnect, isDarkTheme }) {
  const [isMuted, setIsMuted] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  
  // Handlers for remote buttons
  const handleVolumeButton = (action) => {
    console.log(`Volume ${action}`);
    if (action === 'mute') {
      setIsMuted(!isMuted);
    }
  };
  
  const handleChannelButton = (action) => {
    console.log(`Channel ${action}`);
  };
  
  const handleDirectionalPad = (direction) => {
    console.log(`D-Pad ${direction}`);
  };
  
  const handleNumpadButton = (num) => {
    console.log(`Number ${num}`);
  };
  
  const handlePowerButton = () => {
    console.log('Power toggle');
  };
  
  const handleVoiceSubmit = (e) => {
    e.preventDefault();
    console.log(`Voice command: ${voiceText}`);
    setVoiceText('');
    setShowVoiceModal(false);
  };
  
  // Simulated app shortcuts
  const appShortcuts = [
    { name: 'Netflix', color: '#E50914' },
    { name: 'YouTube', color: '#FF0000' },
    { name: 'Prime', color: '#00A8E1' },
    { name: 'Disney+', color: '#0063e5' },
    { name: 'Spotify', color: '#1DB954' },
    { name: 'HBO Max', color: '#5822b4' }
  ];
  
  return (
    <div className={`remote-container ${isDarkTheme ? 'dark' : 'light'}`}>
      <div className="remote-header">
        <h2>{device.name}</h2>
        <button onClick={onDisconnect} className="disconnect-button">
          Disconnect
        </button>
      </div>
      
      {/* Power Button */}
      <div className="power-section">
        <button 
          className="power-button"
          onClick={handlePowerButton}
        >
          Power
        </button>
      </div>
      
      {/* Volume Controls */}
      <div className="control-section">
        <div className="volume-controls">
          <button 
            className={`remote-button ${isMuted ? 'active' : ''}`}
            onClick={() => handleVolumeButton('mute')}
          >
            Mute
          </button>
          <button 
            className="remote-button"
            onClick={() => handleVolumeButton('down')}
          >
            Vol -
          </button>
          <button 
            className="remote-button"
            onClick={() => handleVolumeButton('up')}
          >
            Vol +
          </button>
        </div>
      </div>
      
      {/* D-Pad */}
      <div className="dpad-section">
        <div className="dpad-row">
          <div className="dpad-spacer"></div>
          <button 
            className="dpad-button primary-button"
            onClick={() => handleDirectionalPad('up')}
          >
            ▲
          </button>
          <div className="dpad-spacer"></div>
        </div>
        
        <div className="dpad-row">
          <button 
            className="dpad-button primary-button"
            onClick={() => handleDirectionalPad('left')}
          >
            ◀
          </button>
          <button 
            className="dpad-center primary-button"
            onClick={() => handleDirectionalPad('ok')}
          >
            OK
          </button>
          <button 
            className="dpad-button primary-button"
            onClick={() => handleDirectionalPad('right')}
          >
            ▶
          </button>
        </div>
        
        <div className="dpad-row">
          <div className="dpad-spacer"></div>
          <button 
            className="dpad-button primary-button"
            onClick={() => handleDirectionalPad('down')}
          >
            ▼
          </button>
          <div className="dpad-spacer"></div>
        </div>
      </div>
      
      {/* Channel Controls */}
      <div className="control-section">
        <div className="channel-controls">
          <button 
            className="remote-button"
            onClick={() => handleChannelButton('down')}
          >
            Ch -
          </button>
          <button 
            className="remote-button"
            onClick={() => handleChannelButton('guide')}
          >
            Guide
          </button>
          <button 
            className="remote-button"
            onClick={() => handleChannelButton('up')}
          >
            Ch +
          </button>
        </div>
      </div>
      
      {/* Numpad Toggle */}
      <div className="numpad-toggle">
        <button 
          className={`toggle-button ${showNumpad ? 'active' : ''}`}
          onClick={() => setShowNumpad(!showNumpad)}
        >
          Number Pad
        </button>
      </div>
      
      {/* Numpad (conditionally shown) */}
      {showNumpad && (
        <div className="numpad-section">
          <div className="numpad-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
              <button 
                key={num}
                className="numpad-button"
                onClick={() => handleNumpadButton(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* App Shortcuts */}
      <div className="shortcuts-section">
        <h3>App Shortcuts</h3>
        <div className="shortcuts-grid">
          {appShortcuts.map(app => (
            <button 
              key={app.name}
              className="app-shortcut" 
              style={{backgroundColor: app.color}}
            >
              {app.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Premium Features */}
      <div className="premium-features">
        <button 
          className="premium-button voice-button"
          onClick={() => setShowVoiceModal(true)}
        >
          Voice Control
        </button>
        <button className="premium-button keyboard-button">
          Keyboard Input
        </button>
      </div>
      
      {/* Voice Control Modal */}
      {showVoiceModal && (
        <div className="modal-overlay">
          <div className="voice-modal">
            <h3>Voice Command</h3>
            <form onSubmit={handleVoiceSubmit}>
              <input 
                type="text"
                placeholder="Say something like 'Play Stranger Things'"
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                autoFocus
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowVoiceModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Layout Customization Button */}
      <OneClickLayoutButton isDarkTheme={isDarkTheme} />
    </div>
  );
}

export default RemoteControl;
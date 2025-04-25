import React, { useState } from 'react';
import './App.css';
import RemoteControl from './components/RemoteControl';
import DeviceDiscovery from './components/DeviceDiscovery';

function App() {
  const [currentScreen, setCurrentScreen] = useState('discovery');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  // Simulated function to handle device selection
  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    setCurrentScreen('remote');
  };
  
  // Theme toggle handler
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  
  return (
    <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <header className="app-header">
        <h1>WiFi Remote Control</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkTheme ? '☀️' : '🌙'}
        </button>
      </header>
      
      <main>
        {currentScreen === 'discovery' && (
          <DeviceDiscovery onDeviceSelect={handleDeviceSelect} isDarkTheme={isDarkTheme} />
        )}
        
        {currentScreen === 'remote' && selectedDevice && (
          <RemoteControl 
            device={selectedDevice}
            onDisconnect={() => {
              setSelectedDevice(null);
              setCurrentScreen('discovery');
            }}
            isDarkTheme={isDarkTheme}
          />
        )}
      </main>
      
      <footer>
        <p>WiFi Remote Control App - Preview</p>
      </footer>
    </div>
  );
}

export default App;
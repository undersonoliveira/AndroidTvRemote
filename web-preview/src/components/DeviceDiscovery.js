import React, { useState, useEffect } from 'react';
import './DeviceDiscovery.css';

// Simulated TV devices for demonstration
const SIMULATED_DEVICES = [
  {
    id: 'tv-1',
    name: 'Living Room TV',
    model: 'Android TV XZ-1000',
    ip: '192.168.1.100',
    status: 'available',
    lastSeen: new Date(),
    isPaired: true
  },
  {
    id: 'tv-2',
    name: 'Bedroom TV',
    model: 'Smart Screen 4K',
    ip: '192.168.1.101',
    status: 'available',
    lastSeen: new Date(),
    isPaired: false
  },
  {
    id: 'tv-3',
    name: 'Kitchen TV',
    model: 'Mini Android Display',
    ip: '192.168.1.102',
    status: 'available',
    lastSeen: new Date(),
    isPaired: false
  }
];

function DeviceDiscovery({ onDeviceSelect, isDarkTheme }) {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [filterPaired, setFilterPaired] = useState(false);
  
  // Simulated scan function
  const startScan = () => {
    setIsScanning(true);
    setDevices([]);
    
    // Simulate delay in finding devices
    setTimeout(() => {
      setDevices(SIMULATED_DEVICES);
      setIsScanning(false);
    }, 2000);
  };
  
  // Initial scan on component mount
  useEffect(() => {
    startScan();
  }, []);
  
  // Filter devices based on paired status
  const filteredDevices = filterPaired 
    ? devices.filter(device => device.isPaired)
    : devices;
  
  return (
    <div className={`discovery-container ${isDarkTheme ? 'dark' : 'light'}`}>
      <div className="discovery-header">
        <h2>Find Your TV</h2>
        <p>Select from available devices on your network</p>
      </div>
      
      <div className="discovery-actions">
        <button 
          onClick={startScan} 
          disabled={isScanning}
          className={isScanning ? 'scanning' : ''}
        >
          {isScanning ? 'Scanning...' : 'Scan for TVs'}
        </button>
        
        <label className="paired-filter">
          <input 
            type="checkbox" 
            checked={filterPaired}
            onChange={() => setFilterPaired(!filterPaired)}
          />
          Show paired devices only
        </label>
      </div>
      
      <div className="devices-list">
        {isScanning ? (
          <div className="scanning-indicator">
            <div className="spinner"></div>
            <p>Scanning for Android TVs...</p>
          </div>
        ) : filteredDevices.length > 0 ? (
          filteredDevices.map(device => (
            <div 
              key={device.id}
              className={`device-item ${device.isPaired ? 'paired' : ''}`}
              onClick={() => onDeviceSelect(device)}
            >
              <div className="device-icon">📺</div>
              <div className="device-info">
                <h3>{device.name}</h3>
                <p>{device.model}</p>
                <p className="device-ip">{device.ip}</p>
              </div>
              <div className="device-status">
                {device.isPaired ? (
                  <span className="paired-badge">Paired</span>
                ) : (
                  <span className="connect-badge">Connect</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-devices">
            <p>No devices found. Make sure your TV is on the same network.</p>
          </div>
        )}
      </div>
      
      <div className="discovery-help">
        <h3>Can't find your TV?</h3>
        <ul>
          <li>Ensure your TV is powered on and connected to WiFi</li>
          <li>Check that your phone and TV are on the same network</li>
          <li>Try restarting your TV and scan again</li>
        </ul>
      </div>
    </div>
  );
}

export default DeviceDiscovery;
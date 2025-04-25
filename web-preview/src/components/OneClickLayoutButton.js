import React, { useState } from 'react';
import './OneClickLayoutButton.css';

function OneClickLayoutButton({ isDarkTheme }) {
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Simulated layout presets
  const layoutPresets = [
    { id: 'standard', name: 'Standard', description: 'Default TV remote layout' },
    { id: 'streaming', name: 'Streaming', description: 'Optimized for streaming apps' },
    { id: 'gaming', name: 'Gaming', description: 'Perfect for Android TV games' },
    { id: 'minimal', name: 'Minimal', description: 'Simplified with essential controls only' },
    { id: 'custom', name: 'My Custom', description: 'Your personalized layout' }
  ];
  
  const handlePresetSelect = (preset) => {
    console.log(`Selected preset: ${preset.name}`);
    setShowLayoutModal(false);
  };
  
  return (
    <>
      <button 
        className={`layout-button ${isDarkTheme ? 'dark' : 'light'} ${isEditMode ? 'edit-mode' : ''}`}
        onClick={() => setShowLayoutModal(true)}
        onLongPress={() => setIsEditMode(!isEditMode)}
      >
        {isEditMode ? '✓' : '⊞'}
      </button>
      
      {/* Layout Selector Modal */}
      {showLayoutModal && (
        <div className="layout-modal-overlay">
          <div className={`layout-modal ${isDarkTheme ? 'dark' : 'light'}`}>
            <div className="layout-modal-header">
              <h3>Choose Layout</h3>
              <button 
                className="close-button"
                onClick={() => setShowLayoutModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="layout-presets">
              {layoutPresets.map(preset => (
                <div 
                  key={preset.id}
                  className="layout-preset-item"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div className="preset-icon">⊞</div>
                  <div className="preset-info">
                    <h4>{preset.name}</h4>
                    <p>{preset.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="layout-modal-footer">
              <button 
                className="edit-layout-button"
                onClick={() => {
                  setIsEditMode(true);
                  setShowLayoutModal(false);
                }}
              >
                Customize Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OneClickLayoutButton;
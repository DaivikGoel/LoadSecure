import React, { useState } from 'react';
import Popup from '../Popup/Popup'; // Import your existing Popup component
import { AuthContextProvider } from '../../lib/auth/AuthContextProvider';
import { GlobalStateProvider } from '../../lib/state/GlobalStateProvider';

const SidePanel = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      id="superstar-side-panel-container"
      className={isOpen ? 'open' : 'closed'}
    >
      <div className="superstar-side-panel">
        <button
          className="superstar-toggle-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '→' : '←'}
        </button>

        {isOpen && (
          <div className="superstar-panel-content">
            <AuthContextProvider>
              <GlobalStateProvider>
                <Popup />
              </GlobalStateProvider>
            </AuthContextProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;

import { exportCreator } from './ExportAccount/exporter';

import React from 'react';
import { createRoot } from 'react-dom/client';
import SidePanel from './SidePanel';
import sidePanelStyles from './SidePanel.css'; // Import the CSS

function injectStyles(styles) {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

function createSidePanel() {
  const panelContainer = document.createElement('div');
  panelContainer.id = 'superstar-side-panel-container';
  document.body.appendChild(panelContainer);

  injectStyles(sidePanelStyles); // Inject the styles

  const root = createRoot(panelContainer);
  root.render(<SidePanel />);
}

// Create the side panel as soon as the content script loads
createSidePanel();

const currentUrl = window.location.href;

if (
  currentUrl.includes('instagram.com') ||
  currentUrl.includes('tiktok.com') ||
  currentUrl.includes('youtube.com')
) {
  exportCreator(currentUrl);
}

// Store the current creator
let currentCreator = null;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setCurrentCreator') {
    currentCreator = message.currentCreator;
    console.log('Current creator set to:', currentCreator);
    sendResponse({ status: 'Creator set successfully' });
  } else if (message.action === 'getCurrentCreator') {
    sendResponse({ currentCreator: currentCreator });
  }
  return true; // Indicates we will send a response asynchronously
});

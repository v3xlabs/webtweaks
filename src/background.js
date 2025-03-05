const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

console.log('WebTweaks: Background script loaded');

// Background script to handle keyboard shortcuts and messaging
browserAPI.runtime.onInstalled.addListener(() => {
  // Initialize extension settings
  browserAPI.storage.sync.get(['settings'], (result) => {
    if (!result.settings) {
      console.log('WebTweaks: No settings found, creating default settings');
      browserAPI.storage.sync.set({
        settings: {
          porkbunCleanView: true,
          // Add other settings here as needed
        }
      });
    }
  });
});

// Handle messages from popup
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('WebTweaks: Received message:', message);
  if (message.action === "triggerScript") {
    console.log('WebTweaks: Triggering script:', message.script);
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      
      console.log('WebTweaks: Active tab:', activeTab);
      if (message.script === "porkbunCleanView") {
        console.log('WebTweaks: Executing Porkbun clean view');
        browserAPI.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['scripts/porkbun.js']
        });
      }
      // Add other script triggers as needed
    });
    return true;
  }
  
  if (message.action === "updateSetting") {
    updateSetting(message.setting, message.value);
    return true;
  }
});

function updateSetting(settingName, value) {
  browserAPI.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || {};
    settings[settingName] = value;
    browserAPI.storage.sync.set({ settings });
  });
}

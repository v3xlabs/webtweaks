// Background script to handle keyboard shortcuts and messaging
chrome.runtime.onInstalled.addListener(() => {
  // Initialize extension settings
  chrome.storage.sync.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.sync.set({
        settings: {
          porkbunCleanView: true,
          // Add other settings here as needed
        }
      });
    }
  });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "triggerScript") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      
      if (message.script === "porkbunCleanView") {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: executePorkbunCleanView
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
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || {};
    settings[settingName] = value;
    chrome.storage.sync.set({ settings });
  });
}

function executePorkbunCleanView() {
  // Will be replaced by the actual function in content script
  // This is just a placeholder for the executeScript API
  console.log("Porkbun clean view executed");
}

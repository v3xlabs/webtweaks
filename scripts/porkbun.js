// Porkbun Clean View script
(() => {
  const settings = { enabled: true }; // Default setting
  
  // First, check if the feature is enabled
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings && result.settings.porkbunCleanView === false) {
      settings.enabled = false;
    }
    
    // Listen for manual triggers from the popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "triggerPorkbunCleanView") {
        cleanPorkbunView();
        sendResponse({ success: true });
      }
    });
  });
  
  // Function to clean up Porkbun search results
  function cleanPorkbunView() {
    // Click the button
    const myButton = document.querySelector('#mybutton');
    if (myButton) {
      myButton.click();
    }
    
    // Remove unavailable domains
    if (typeof $ !== 'undefined') {
      $('.unavailableDomain').parent().parent().parent().remove();
    } else {
      // Fallback if jQuery isn't available
      document.querySelectorAll('.unavailableDomain').forEach(elem => {
        let parent = elem.parentNode.parentNode.parentNode;
        if (parent) {
          parent.remove();
        }
      });
    }
    
    console.log('WebTweaks: Porkbun clean view applied');
  }
  
  // Run automatically if enabled
  if (settings.enabled) {
    // Wait for page to fully load
    window.addEventListener('load', () => {
      setTimeout(cleanPorkbunView, 1000);
    });
  }
})();

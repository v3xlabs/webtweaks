document.addEventListener('DOMContentLoaded', function() {
  // Load current settings
  chrome.storage.sync.get(['settings'], function(result) {
    const settings = result.settings || {};
    
    // Set toggle states based on stored settings
    const porkbunToggle = document.getElementById('porkbunCleanToggle');
    if (porkbunToggle) {
      porkbunToggle.checked = settings.porkbunCleanView !== false;
      
      // Add event listener for toggle changes
      porkbunToggle.addEventListener('change', function() {
        chrome.runtime.sendMessage({
          action: 'updateSetting',
          setting: 'porkbunCleanView',
          value: this.checked
        });
      });
    }
  });
  
  // Set up ad-hoc action buttons
  const porkbunCleanBtn = document.getElementById('porkbunCleanBtn');
  if (porkbunCleanBtn) {
    porkbunCleanBtn.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const url = new URL(currentTab.url);
        
        if (url.hostname === 'porkbun.com' && url.pathname.includes('/checkout/search')) {
          chrome.tabs.sendMessage(currentTab.id, {
            action: 'triggerPorkbunCleanView'
          });
        } else {
          // Show message when not on Porkbun search page
          porkbunCleanBtn.textContent = "Not on Porkbun search page";
          porkbunCleanBtn.disabled = true;
          setTimeout(() => {
            porkbunCleanBtn.textContent = "Porkbun Clean View";
            porkbunCleanBtn.disabled = false;
          }, 2000);
        }
      });
    });
  }
});

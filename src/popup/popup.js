const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', async function() {
  // Load current settings
  const result = await browserAPI.storage.sync.get('settings');
  const settings = result.settings || {};
  
  // Set toggle states based on stored settings
  const porkbunToggle = document.getElementById('porkbunCleanToggle');
  if (porkbunToggle) {
    porkbunToggle.checked = settings.porkbunCleanView !== false;
    
    // Add event listener for toggle changes
    porkbunToggle.addEventListener('change', function() {
      browserAPI.runtime.sendMessage({
        action: 'updateSetting',
        setting: 'porkbunCleanView',
        value: this.checked
      });
    });
  }
  
  // Set up ad-hoc action buttons
  const porkbunCleanBtn = document.getElementById('porkbunCleanBtn');
  if (porkbunCleanBtn) {
    porkbunCleanBtn.addEventListener('click', async function() {
      const tabs = await browserAPI.tabs.query({active: true, currentWindow: true});
      const currentTab = tabs[0];
      const url = new URL(currentTab.url);
      
      if (url.hostname === 'porkbun.com' && url.pathname.includes('/checkout/search')) {
        // Send message to background script instead of directly to tab
        browserAPI.runtime.sendMessage({
          action: 'triggerScript',
          script: 'porkbunCleanView'
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
  }
});


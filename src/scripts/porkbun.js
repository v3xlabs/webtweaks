// Porkbun Clean View script
(() => {
  console.log('WebTweaks: Porkbun script loaded');

  // Get the browser API namespace
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  
  // Listen for manual triggers from the popup
  // browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   if (message.action === "triggerPorkbunCleanView") {
  //     cleanPorkbunView();
  //     sendResponse({ success: true });
  //   }
  // });
  
  // Function to clean up Porkbun search results
  function cleanPorkbunView() {
    console.log('WebTweaks: Cleaning Porkbun view');
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

  cleanPorkbunView();
})();

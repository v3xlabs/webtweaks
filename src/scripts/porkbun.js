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

    // Find and click the button inside the specified form
    const formButton = document.querySelector('form[action="/checkout/search"]:has(input[type="hidden"][name="all"][value="mando"]) button');
    if (formButton) {
      formButton.click();
    } else {
      console.log('WebTweaks: Button not found');
    }

    console.log('Waiting for all .pull-right elements to disappear');
    // Wait for all .pull-right elements to disappear
    const waitForPullRightToDisappear = setInterval(() => {
      const elements = document.querySelectorAll('.searchResultRowCell img[alt="Loading..."][src="/images/loading.small.gif"]');
      console.log('Remaining elements:', elements);
      if (elements.length === 0) {
        clearInterval(waitForPullRightToDisappear);

        console.log('All .pull-right elements have disappeared');
        // Proceed with the rest of the existing cleanPorkbunView logic
        if (typeof $ !== 'undefined') {
          console.log('WebTweaks: jQuery is available');
          setTimeout(() => {
            $('.unavailableDomain').parent().parent().parent().remove();
          }, 1000);
        } else {
          document.querySelectorAll('.unavailableDomain').forEach(elem => {
            let parent = elem.parentNode.parentNode.parentNode;
            if (parent) {
              parent.remove();
            }
          });
        }

        console.log('WebTweaks: Porkbun clean view applied');
      }
    }, 500); // Check every 500ms
  }

  cleanPorkbunView();
})();

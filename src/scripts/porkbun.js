// Porkbun Clean View script
(() => {
  console.log('WebTweaks: Porkbun script loaded');

  // Get the browser API namespace
  // const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  
  // Listen for manual triggers from the popup
  // browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   if (message.action === "triggerPorkbunCleanView") {
  //     cleanPorkbunView();
  //     sendResponse({ success: true });
  //   }
  // });
  
  // Toast management functions with progress bar
  const Toast = (() => {
    let toastElem = null;
    let progressBar = null;
    let toastText = null;
    let hideTimeout = null;
    let maxValue = 0;
    let progressContainer = null;

    function createToast() {
      if (!toastElem) {
        // Toast container
        toastElem = document.createElement('div');
        toastElem.style.position = 'fixed';
        toastElem.style.bottom = '10px';
        toastElem.style.right = '10px';
        toastElem.style.backgroundColor = 'rgba(0,0,0,0.7)';
        toastElem.style.color = '#fff';
        toastElem.style.padding = '8px 12px';
        toastElem.style.borderRadius = '4px';
        toastElem.style.fontSize = '12px';
        toastElem.style.zIndex = '999999';
        toastElem.style.fontFamily = 'Arial, sans-serif';
        toastElem.style.minWidth = '150px';
        toastElem.style.textAlign = 'center';

        // Text element
        toastText = document.createElement('div');
        toastElem.appendChild(toastText);

        // Progress bar container
        progressContainer = document.createElement('div');
        progressContainer.style.width = '100%';
        progressContainer.style.height = '4px';
        progressContainer.style.backgroundColor = 'rgba(255,255,255,0.3)';
        progressContainer.style.borderRadius = '2px';
        progressContainer.style.marginTop = '6px';
        toastElem.appendChild(progressContainer);

        // Progress bar itself
        progressBar = document.createElement('div');
        progressBar.style.width = '100%';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#4caf50';
        progressBar.style.borderRadius = '2px';
        progressContainer.appendChild(progressBar);

        document.body.appendChild(toastElem);
      }
    }

    function updateToast(currentValue) {
      createToast();
      if (currentValue > maxValue) {
        maxValue = currentValue;
      }
      if (currentValue > 0) {
        toastText.textContent = `Waiting for ${currentValue}/${maxValue} domains to resolve`;
        const progressPercent = ((maxValue - currentValue) / maxValue) * 100;
        progressBar.style.width = `${progressPercent}%`;
        clearTimeout(hideTimeout);
      } else {
        toastText.textContent = 'Porkbun cleanup complete!';
        progressBar.style.width = '100%';
        clearTimeout(hideTimeout);

        // delete progressBarContainer
        progressContainer?.remove();

        hideTimeout = setTimeout(removeToast, 5000);
        maxValue = 0; // reset for next use
      }
    }

    function removeToast() {
      if (toastElem) {
        toastElem.remove();
        toastElem = null;
        progressBar = null;
        toastText = null;
      }
    }

    return { update: updateToast };
  })();

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
      const remaining = elements.length;
      Toast.update(remaining); // Update toast here

      if (remaining === 0) {
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

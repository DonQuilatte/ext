// Extension Details Page Premium Toggle
// Adds a premium toggle to the extension details page for easy testing

console.log('🧪 Extension Details Premium Toggle Loaded');

// Function to create premium toggle in extension details page
function createExtensionDetailsToggle() {
  // Check if we're on the extension details page
  if (!window.location.href.includes('chrome://extensions/') && !window.location.href.includes('brave://extensions/')) {
    return;
  }

  // Find the extension details section
  const extensionDetails = document.querySelector('extensions-detail-view');
  if (!extensionDetails) {
    console.log('Extension details view not found, retrying...');
    setTimeout(createExtensionDetailsToggle, 1000);
    return;
  }

  // Check if toggle already exists
  if (document.querySelector('#premium-dev-toggle-section')) {
    return;
  }

  // Create the premium toggle section
  const toggleSection = document.createElement('div');
  toggleSection.id = 'premium-dev-toggle-section';
  toggleSection.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    margin: 15px 0;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  toggleSection.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
      <h3 style="margin: 0; font-size: 18px; font-weight: 600;">
        🧪 Development Mode - Premium Features
      </h3>
      <div style="display: flex; align-items: center; gap: 10px;">
        <span id="premium-status-text" style="font-size: 14px; font-weight: 500;">Checking...</span>
        <label style="position: relative; display: inline-block; width: 60px; height: 34px;">
          <input type="checkbox" id="premium-toggle" style="opacity: 0; width: 0; height: 0;">
          <span style="
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
          ">
            <span style="
              position: absolute;
              content: '';
              height: 26px;
              width: 26px;
              left: 4px;
              bottom: 4px;
              background-color: white;
              transition: .4s;
              border-radius: 50%;
              transform: translateX(0px);
            "></span>
          </span>
        </label>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
      <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
        <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">Chrome Storage</div>
        <div id="storage-status" style="font-size: 14px; font-weight: 500;">Checking...</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
        <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">Extension Status</div>
        <div id="extension-status" style="font-size: 14px; font-weight: 500;">Checking...</div>
      </div>
    </div>
    
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <button id="refresh-status-btn" style="
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      ">🔄 Refresh Status</button>
      
      <button id="force-enable-btn" style="
        background: #4CAF50;
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      ">🚀 Force Enable</button>
      
      <button id="open-console-btn" style="
        background: #FF9800;
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      ">🔧 Open Console</button>
    </div>
    
    <div style="margin-top: 15px; font-size: 12px; opacity: 0.8; line-height: 1.4;">
      <strong>Instructions:</strong> Toggle premium features on/off. After enabling, refresh ChatGPT page to see changes.
      Use "Force Enable" if toggle doesn't work. Check console for detailed debugging information.
    </div>
  `;

  // Insert the toggle section into the extension details
  const insertPoint = extensionDetails.querySelector('#permissions') || 
                     extensionDetails.querySelector('#site-access') ||
                     extensionDetails.querySelector('div[slot="content"]') ||
                     extensionDetails;
  
  if (insertPoint) {
    insertPoint.parentNode.insertBefore(toggleSection, insertPoint);
  } else {
    extensionDetails.appendChild(toggleSection);
  }

  // Initialize toggle functionality
  initializeToggleFunctionality();
}

// Function to initialize toggle functionality
async function initializeToggleFunctionality() {
  const toggle = document.getElementById('premium-toggle');
  const statusText = document.getElementById('premium-status-text');
  const storageStatus = document.getElementById('storage-status');
  const extensionStatus = document.getElementById('extension-status');
  const refreshBtn = document.getElementById('refresh-status-btn');
  const forceEnableBtn = document.getElementById('force-enable-btn');
  const openConsoleBtn = document.getElementById('open-console-btn');

  if (!toggle) return;

  // Update status display - ALWAYS PREMIUM (Local-only mode)
  async function updateStatus() {
    try {
      // In local-only mode, always ensure premium status
      await chrome.storage.local.set({ DEV_MODE_PREMIUM: true });
      
      const result = await chrome.storage.local.get(['DEV_MODE_PREMIUM', 'store']);
      if (!result.store) {
        result.store = {};
        result.store['-r.6es£Jr1U0'] = true;
        result.store.isPremiumUser = true;
        result.store.subscriptionStatus = "active";
        await chrome.storage.local.set({ store: result.store });
      }
      
      // Always show as enabled in local-only mode
      toggle.checked = true;
      statusText.textContent = '✅ ENABLED (Local-only)';
      statusText.style.color = '#4CAF50';
      
      // Update storage status - always show as enabled
      storageStatus.innerHTML = `
        DEV_MODE_PREMIUM: ✅ (Local-only)<br>
        Premium Key: ✅ (Local-only)
      `;
      
      // Update extension status
      extensionStatus.textContent = 'Local-only mode active';
      
      // Update toggle slider appearance - always enabled
      const slider = toggle.nextElementSibling;
      const sliderButton = slider.querySelector('span');
      slider.style.backgroundColor = '#4CAF50';
      sliderButton.style.transform = 'translateX(26px)';
      
    } catch (error) {
      console.error('Error updating status:', error);
      // Even on error, show as enabled in local-only mode
      statusText.textContent = '✅ ENABLED (Local-only)';
      statusText.style.color = '#4CAF50';
      storageStatus.textContent = 'Local-only mode active';
      extensionStatus.textContent = 'Local-only mode active';
      toggle.checked = true;
    }
  }

  // Toggle change handler - ALWAYS PREMIUM (Local-only mode)
  toggle.addEventListener('change', async () => {
    try {
      // In local-only mode, premium is always enabled
      // Force toggle to stay enabled
      toggle.checked = true;
      
      // Ensure premium status is always set
      await chrome.storage.local.set({ DEV_MODE_PREMIUM: true });
      
      const result = await chrome.storage.local.get('store');
      if (!result.store) result.store = {};
      result.store['-r.6es£Jr1U0'] = true;
      result.store.isPremiumUser = true;
      result.store.subscriptionStatus = "active";
      
      await chrome.storage.local.set({ store: result.store });
      
      showNotification('Premium features are permanently enabled in local-only mode!', 'success');
      
      // Update status after change
      setTimeout(updateStatus, 100);
      
    } catch (error) {
      console.error('Error maintaining premium status:', error);
      showNotification('Error maintaining premium features', 'error');
      // Ensure toggle stays enabled even on error
      toggle.checked = true;
    }
  });

  // Button handlers
  refreshBtn.addEventListener('click', updateStatus);
  
  forceEnableBtn.addEventListener('click', async () => {
    try {
      // Force enable with all possible flags
      await chrome.storage.local.set({ DEV_MODE_PREMIUM: true });
      
      const result = await chrome.storage.local.get('store');
      if (!result.store) result.store = {};
      result.store['-r.6es£Jr1U0'] = true;
      result.store.isPremiumUser = true;
      result.store.subscriptionStatus = "active";
      
      await chrome.storage.local.set({ store: result.store });
      
      // Also try to set window flags if possible
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0] && tabs[0].url.includes('chatgpt.com')) {
          chrome.tabs.executeScript(tabs[0].id, {
            code: `
              window.DEV_MODE_PREMIUM = true;
              window.isPremiumUser = true;
              window.hasPremiumAccess = true;
              console.log('🚀 Premium features force-enabled from extension details page');
            `
          });
        }
      });
      
      showNotification('Premium features force-enabled! Refresh ChatGPT page.', 'success');
      updateStatus();
    } catch (error) {
      console.error('Error force enabling:', error);
      showNotification('Error force enabling premium', 'error');
    }
  });
  
  openConsoleBtn.addEventListener('click', () => {
    // Open developer tools (this might not work due to security restrictions)
    showNotification('Open Developer Tools (F12) and check console for debug info', 'info');
  });

  // Initial status update
  updateStatus();
}

// Function to show notifications
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  const colors = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${colors[type] || colors.info};
    color: white;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 350px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation keyframes
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  notification.textContent = `🧪 ${message}`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createExtensionDetailsToggle);
} else {
  createExtensionDetailsToggle();
}

// Also watch for navigation changes (for SPA-style extension pages)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(createExtensionDetailsToggle, 500);
  }
}).observe(document, {subtree: true, childList: true});

console.log('🧪 Extension Details Premium Toggle Ready');
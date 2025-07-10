// Development Settings UI Component
// Adds a dev mode toggle to the settings modal

function createDevModeSettingsHTML() {
  return `
    <div class="dev-mode-settings" style="
      border: 2px dashed #ff9800; 
      padding: 15px; 
      margin: 10px 0; 
      border-radius: 8px; 
      background: rgba(255, 152, 0, 0.1);
    ">
      <h3 style="margin: 0 0 10px 0; color: #ff9800; font-size: 16px;">
        🧪 Development Mode
      </h3>
      <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">
        Enable Premium features for development and testing purposes.
      </p>
      
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <label style="font-weight: bold;">Premium Features:</label>
        <label class="switch">
          <input type="checkbox" id="devModePremiumToggle">
          <span class="slider round"></span>
        </label>
        <span id="devModeStatus" style="font-size: 12px; color: #666;"></span>
      </div>
      
      <div style="font-size: 12px; color: #888; line-height: 1.4;">
        <strong>Keyboard Shortcut:</strong> Ctrl+Shift+D<br>
        <strong>Console Commands:</strong> devMode.enable(), devMode.disable(), devMode.status()
      </div>
    </div>
  `;
}

// Function to inject dev mode settings into the settings modal
function injectDevModeSettings() {
  // Find the settings modal content
  const settingsModal = document.querySelector('[data-modal-type="SETTINGS"]');
  if (!settingsModal) return;
  
  // Find a good place to inject (after the first settings section)
  const settingsContent = settingsModal.querySelector('.modal-content');
  if (!settingsContent) return;
  
  // Check if already injected
  if (settingsModal.querySelector('.dev-mode-settings')) return;
  
  // Create and inject the dev settings
  const devSettingsContainer = document.createElement('div');
  devSettingsContainer.innerHTML = createDevModeSettingsHTML();
  
  // Insert at the top of settings content
  settingsContent.insertBefore(devSettingsContainer, settingsContent.firstChild);
  
  // Initialize the toggle state
  updateDevModeToggle();
  
  // Add event listener for toggle
  const toggle = settingsModal.querySelector('#devModePremiumToggle');
  if (toggle) {
    toggle.addEventListener('change', handleDevModeToggle);
  }
}

// Function to update the toggle state based on current dev mode status
async function updateDevModeToggle() {
  try {
    const result = await chrome.storage.local.get('DEV_MODE_PREMIUM');
    const isEnabled = result.DEV_MODE_PREMIUM === true;
    
    const toggle = document.querySelector('#devModePremiumToggle');
    const status = document.querySelector('#devModeStatus');
    
    if (toggle) {
      toggle.checked = isEnabled;
    }
    
    if (status) {
      status.textContent = isEnabled ? '✅ ENABLED' : '❌ DISABLED';
      status.style.color = isEnabled ? '#4CAF50' : '#f44336';
    }
  } catch (error) {
    console.error('Error updating dev mode toggle:', error);
  }
}

// Function to handle toggle changes
async function handleDevModeToggle(event) {
  const isEnabled = event.target.checked;
  
  try {
    if (isEnabled) {
      await chrome.storage.local.set({ DEV_MODE_PREMIUM: true });
      
      // Also set the user as paid in the main store
      const result = await chrome.storage.local.get('store');
      if (result.store) {
        result.store['-r.6es£Jr1U0'] = true;
        await chrome.storage.local.set({ store: result.store });
      }
      
      console.log('🚀 DEV MODE: Premium features ENABLED via settings');
    } else {
      await chrome.storage.local.set({ DEV_MODE_PREMIUM: false });
      
      // Reset paid user status
      const result = await chrome.storage.local.get('store');
      if (result.store) {
        result.store['-r.6es£Jr1U0'] = false;
        await chrome.storage.local.set({ store: result.store });
      }
      
      console.log('🔒 DEV MODE: Premium features DISABLED via settings');
    }
    
    // Update the status display
    updateDevModeToggle();
    
    // Show a brief notification
    showDevModeNotification(
      isEnabled ? 'Premium features enabled' : 'Premium features disabled',
      isEnabled ? 'success' : 'info'
    );
    
  } catch (error) {
    console.error('Error toggling dev mode:', error);
    // Revert the toggle on error
    event.target.checked = !isEnabled;
  }
}

// Function to show notification
function showDevModeNotification(message, type = "info") {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
    color: white;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: opacity 0.3s ease;
  `;
  notification.textContent = `🧪 DEV: ${message}`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 2000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDevSettings);
} else {
  initializeDevSettings();
}

function initializeDevSettings() {
  // Watch for settings modal to open
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if settings modal was added
          const settingsModal = node.querySelector?.('[data-modal-type="SETTINGS"]') || 
                               (node.dataset?.modalType === 'SETTINGS' ? node : null);
          
          if (settingsModal) {
            // Small delay to ensure modal is fully rendered
            setTimeout(() => {
              injectDevModeSettings();
            }, 100);
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also check if settings modal is already open
  setTimeout(() => {
    injectDevModeSettings();
  }, 1000);
}

// Export for use by other scripts
if (typeof window !== 'undefined') {
  window.devModeSettings = {
    inject: injectDevModeSettings,
    update: updateDevModeToggle
  };
}
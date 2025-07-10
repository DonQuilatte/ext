// Development Mode Toggle Script
// This script allows enabling/disabling Premium features for testing purposes

console.log("Development Mode Script Loaded");

// Function to enable Premium features for development
async function enableDevMode() {
  try {
    await chrome.storage.local.set({ DEV_MODE_PREMIUM: true });
    console.log("🚀 DEV MODE: Premium features ENABLED for testing");
    
    // Also set the user as paid in the main store for consistency
    const result = await chrome.storage.local.get('store');
    if (result.store) {
      result.store['-r.6es£Jr1U0'] = true; // Set isPaidUser to true
      await chrome.storage.local.set({ store: result.store });
    }
    
    // Show notification
    showDevModeNotification("Premium features enabled for development", "success");
  } catch (error) {
    console.error("Error enabling dev mode:", error);
  }
}

// Function to disable Premium features
async function disableDevMode() {
  try {
    await chrome.storage.local.set({ DEV_MODE_PREMIUM: false });
    console.log("🔒 DEV MODE: Premium features DISABLED");
    
    // Reset paid user status
    const result = await chrome.storage.local.get('store');
    if (result.store) {
      result.store['-r.6es£Jr1U0'] = false; // Set isPaidUser to false
      await chrome.storage.local.set({ store: result.store });
    }
    
    // Show notification
    showDevModeNotification("Premium features disabled", "info");
  } catch (error) {
    console.error("Error disabling dev mode:", error);
  }
}

// Function to check current dev mode status
async function checkDevModeStatus() {
  try {
    const result = await chrome.storage.local.get('DEV_MODE_PREMIUM');
    const isEnabled = result.DEV_MODE_PREMIUM === true;
    console.log(`🔍 DEV MODE Status: ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
    return isEnabled;
  } catch (error) {
    console.error("Error checking dev mode status:", error);
    return false;
  }
}

// Function to show visual notification (if running in content script context)
function showDevModeNotification(message, type = "info") {
  if (typeof document !== 'undefined') {
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
    notification.textContent = `🧪 DEV MODE: ${message}`;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Add keyboard shortcut listener (Ctrl+Shift+D)
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', async (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
      event.preventDefault();
      const currentStatus = await checkDevModeStatus();
      if (currentStatus) {
        await disableDevMode();
      } else {
        await enableDevMode();
      }
    }
  });
}

// Add console commands for easy access
if (typeof window !== 'undefined') {
  window.devMode = {
    enable: enableDevMode,
    disable: disableDevMode,
    status: checkDevModeStatus,
    help: () => {
      console.log(`
🧪 Development Mode Commands:
- devMode.enable()  : Enable Premium features for testing
- devMode.disable() : Disable Premium features  
- devMode.status()  : Check current status
- Ctrl+Shift+D     : Toggle dev mode

Current Status: ${checkDevModeStatus() ? 'ENABLED' : 'DISABLED'}
      `);
    }
  };
  
  console.log("🧪 Dev Mode Commands Available:");
  console.log("- devMode.enable() - Enable Premium features");
  console.log("- devMode.disable() - Disable Premium features");
  console.log("- devMode.status() - Check status");
  console.log("- devMode.help() - Show this help");
  console.log("- Keyboard: Ctrl+Shift+D to toggle");
}

// Auto-check status on load
checkDevModeStatus();
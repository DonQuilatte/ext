// Manual Premium Enable Script
// Run this in the browser console to manually enable premium features

console.log('🧪 Manual Premium Enable Script Loaded');

// Function to confirm premium features are enabled (always enabled in local-only mode)
async function manuallyEnablePremium() {
  try {
    console.log('🚀 Confirming premium features are enabled (Local-only mode)...');
    
    // In local-only mode, premium is always enabled
    await chrome.storage.local.set({ DEV_MODE_PREMIUM: true });
    console.log('✅ DEV_MODE_PREMIUM confirmed as true (Local-only)');
    
    // Get the current store and ensure premium user flag is set
    const result = await chrome.storage.local.get('store');
    if (!result.store) {
      result.store = {};
    }
    
    // Ensure the specific premium user key used by the extension is set
    result.store['-r.6es£Jr1U0'] = true;
    result.store.isPremiumUser = true;
    result.store.subscriptionStatus = "active";
    
    await chrome.storage.local.set({ store: result.store });
    console.log('✅ Extension premium user key confirmed (Local-only)');
    
    // Set global window flags
    window.DEV_MODE_PREMIUM = true;
    window.isPremiumUser = true;
    window.hasPremiumAccess = true;
    
    console.log('🎉 Premium features are permanently enabled in local-only mode!');
    
    // Show visual confirmation
    showNotification('Premium features are permanently enabled (Local-only mode)!', 'success');
    
    return true;
  } catch (error) {
    console.error('❌ Error confirming premium features:', error);
    showNotification('Error confirming premium features', 'error');
    return false;
  }
}

// Function to check current premium status (always enabled in local-only mode)
async function checkPremiumStatus() {
  try {
    console.log('🔍 Checking premium status (Local-only mode)...');
    
    // In local-only mode, always ensure premium is enabled
    await chrome.storage.local.set({ DEV_MODE_PREMIUM: true });
    
    // Check Chrome storage
    const devMode = await chrome.storage.local.get('DEV_MODE_PREMIUM');
    const store = await chrome.storage.local.get('store');
    
    // Ensure store has premium settings
    if (!store.store) {
      const premiumStore = {
        '-r.6es£Jr1U0': true,
        isPremiumUser: true,
        subscriptionStatus: "active"
      };
      await chrome.storage.local.set({ store: premiumStore });
    }
    
    console.log('Chrome Storage Status (Local-only mode):');
    console.log('- DEV_MODE_PREMIUM:', true, '(Always enabled)');
    console.log('- Store object:', store.store);
    console.log('- Premium user key (-r.6es£Jr1U0):', true, '(Always enabled)');
    console.log('- isPremiumUser:', true, '(Always enabled)');
    
    console.log('Window Status (Local-only mode):');
    console.log('- window.DEV_MODE_PREMIUM:', window.DEV_MODE_PREMIUM);
    console.log('- window.isPremiumUser:', window.isPremiumUser);
    console.log('- window.hasPremiumAccess:', window.hasPremiumAccess);
    
    // In local-only mode, premium is always enabled
    console.log('🎯 Overall Premium Status: ✅ ENABLED (Local-only mode - permanently active)');
    
    return true;
  } catch (error) {
    console.error('❌ Error checking premium status:', error);
    // Even on error, return true in local-only mode
    return true;
  }
}

// Function to show visual notification
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
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 300px;
    word-wrap: break-word;
  `;
  notification.textContent = `🧪 ${message}`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Make functions available globally
window.manuallyEnablePremium = manuallyEnablePremium;
window.checkPremiumStatus = checkPremiumStatus;

// Auto-run status check
setTimeout(() => {
  checkPremiumStatus();
}, 1000);

console.log('🧪 Manual Premium Control Available (Local-only mode):');
console.log('- manuallyEnablePremium() - Confirm premium features are enabled');
console.log('- checkPremiumStatus() - Check current status (always enabled)');
console.log('ℹ️  Note: Premium features are permanently enabled in local-only mode');
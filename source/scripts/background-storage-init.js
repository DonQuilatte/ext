/**
 * Background Storage Initialization
 * Ensures critical storage keys are initialized when the extension starts
 */

// Initialize critical storage keys for background script
async function initializeBackgroundStorage() {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    console.warn('Chrome storage API not available in background');
    return;
  }

  const criticalKeys = {
    'isResetChatHistory': false,
    'local_folders': [],
    'local_prompts': [],
    'local_chains': [],
    'local_pinned': [],
    'local_announcements': [],
    'local_user_data': { isPaid: true, accountId: 'local-user' },
    'store': {
      selectedItems: [],
      selectedManageTabsItem: 'ACTIVE_CHATS',
      selectedModalType: undefined,
      sidebarClickListenerAdded: false,
      folders: [],
      selectedFolder: undefined,
      injectedTabs: false,
      prompts: [],
      chains: [],
      pinnedChats: {},
      pinnedFolders: {},
      direction: 'ltr',
      GPTs: [],
      sharedGPTs: []
    }
  };

  try {
    // Get all existing storage values
    const existingStorage = await chrome.storage.local.get(null);
    
    // Initialize missing keys
    const updates = {};
    for (const [key, defaultValue] of Object.entries(criticalKeys)) {
      if (!(key in existingStorage) || existingStorage[key] === undefined || existingStorage[key] === null) {
        updates[key] = defaultValue;
      }
    }
    
    // Save any missing keys
    if (Object.keys(updates).length > 0) {
      await chrome.storage.local.set(updates);
      console.log('🔧 BACKGROUND STORAGE: Initialized missing storage keys:', Object.keys(updates));
    }
  } catch (error) {
    console.error('🚨 BACKGROUND STORAGE: Failed to initialize storage:', error);
  }
}

// Safe getter functions for background script
function safeGetIsResetChatHistory() {
  return chrome.storage.local.get('isResetChatHistory').then((result) => {
    return result && result.isResetChatHistory !== undefined ? result.isResetChatHistory : false;
  }).catch((error) => {
    console.warn('🚨 BACKGROUND STORAGE: Failed to get isResetChatHistory:', error);
    return false;
  });
}

function safeGetLocalFolders() {
  return chrome.storage.local.get('local_folders').then((result) => {
    return result && result.local_folders !== undefined ? result.local_folders : [];
  }).catch((error) => {
    console.warn('🚨 BACKGROUND STORAGE: Failed to get local_folders:', error);
    return [];
  });
}

// Export functions for use in background script
if (typeof globalThis !== 'undefined') {
  globalThis.safeGetIsResetChatHistory = safeGetIsResetChatHistory;
  globalThis.safeGetLocalFolders = safeGetLocalFolders;
  globalThis.initializeBackgroundStorage = initializeBackgroundStorage;
}

// Initialize storage when script loads
initializeBackgroundStorage();

console.log('🔧 BACKGROUND STORAGE: Initialization script loaded');
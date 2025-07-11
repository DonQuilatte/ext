/**
 * Safe Chrome Storage Wrapper
 * Prevents undefined property access errors in extension storage operations
 */

// Add global storage safety wrapper
if (typeof chrome !== 'undefined' && chrome.storage) {
  // Wrap chrome.storage.local.get to ensure it always returns a valid object
  const originalGet = chrome.storage.local.get;
  chrome.storage.local.get = function(keys, callback) {
    if (callback) {
      // Legacy callback-based API
      return originalGet.call(this, keys, (result) => {
        const safeResult = result || {};
        // Ensure requested keys exist with default values
        if (typeof keys === 'string') {
          if (safeResult[keys] === undefined) {
            safeResult[keys] = getDefaultValue(keys);
          }
        } else if (Array.isArray(keys)) {
          keys.forEach(key => {
            if (safeResult[key] === undefined) {
              safeResult[key] = getDefaultValue(key);
            }
          });
        }
        callback(safeResult);
      });
    } else {
      // Promise-based API
      return originalGet.call(this, keys).then((result) => {
        const safeResult = result || {};
        // Ensure requested keys exist with default values
        if (typeof keys === 'string') {
          if (safeResult[keys] === undefined) {
            safeResult[keys] = getDefaultValue(keys);
          }
        } else if (Array.isArray(keys)) {
          keys.forEach(key => {
            if (safeResult[key] === undefined) {
              safeResult[key] = getDefaultValue(key);
            }
          });
        }
        return safeResult;
      });
    }
  };
}

function getDefaultValue(key) {
  const defaults = {
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
  return defaults[key] || null;
}

// Initialize critical storage keys if they don't exist
async function initializeCriticalStorage() {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    console.warn('Chrome storage API not available');
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
      const hasKey = existingStorage && typeof existingStorage === 'object' && existingStorage.hasOwnProperty(key);
      if (!hasKey || existingStorage[key] === undefined || existingStorage[key] === null) {
        updates[key] = defaultValue;
      }
    }
    
    // Save any missing keys
    if (Object.keys(updates).length > 0) {
      await chrome.storage.local.set(updates);
      console.log('🔧 SAFE STORAGE: Initialized missing storage keys:', Object.keys(updates));
    }
  } catch (error) {
    console.error('🚨 SAFE STORAGE: Failed to initialize storage:', error);
  }
}

// Add safe property access helpers
window.safeStorageGet = async function(key, defaultValue = null) {
  try {
    const result = await chrome.storage.local.get(key);
    return result && result[key] !== undefined ? result[key] : defaultValue;
  } catch (error) {
    console.warn(`🚨 SAFE STORAGE: Failed to get ${key}:`, error);
    return defaultValue;
  }
};

window.safeStorageSet = async function(key, value) {
  try {
    await chrome.storage.local.set({ [key]: value });
    return true;
  } catch (error) {
    console.error(`🚨 SAFE STORAGE: Failed to set ${key}:`, error);
    return false;
  }
};

// Initialize storage when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCriticalStorage);
} else {
  initializeCriticalStorage();
}

// Also initialize immediately for background scripts
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
  initializeCriticalStorage();
}

console.log('🔧 SAFE STORAGE: Wrapper initialized');
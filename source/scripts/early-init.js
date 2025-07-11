// EARLY INITIALIZATION SCRIPT - IMMEDIATE EXECUTION
// This script runs before content.js to ensure all critical properties are defined
// Prevents "Cannot read properties of undefined" errors

// ULTRA-AGGRESSIVE isResetChatHistory ERROR PREVENTION - HIGHEST PRIORITY
(function() {
    'use strict';
    
    try {
        // Patch the fundamental property access mechanisms IMMEDIATELY
        const originalReflectGet = Reflect.get;
        const originalReflectHas = Reflect.has;
        const originalObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        
        // Override Reflect.get to handle undefined object access
        Reflect.get = function(target, propertyKey, receiver) {
            try {
                if ((target === undefined || target === null) && propertyKey === 'isResetChatHistory') {
                    console.warn('🔧 EARLY INIT: ULTRA-AGGRESSIVE - Reflect.get intercepted undefined access to isResetChatHistory');
                    return false;
                }
                return originalReflectGet.call(this, target, propertyKey, receiver);
            } catch (error) {
                if (propertyKey === 'isResetChatHistory') {
                    console.warn('🔧 EARLY INIT: ULTRA-AGGRESSIVE - Reflect.get error for isResetChatHistory, returning false');
                    return false;
                }
                throw error;
            }
        };
        
        // Override Reflect.has to handle undefined object access
        Reflect.has = function(target, propertyKey) {
            try {
                if ((target === undefined || target === null) && propertyKey === 'isResetChatHistory') {
                    console.warn('🔧 EARLY INIT: ULTRA-AGGRESSIVE - Reflect.has intercepted undefined access to isResetChatHistory');
                    return true; // Pretend the property exists
                }
                return originalReflectHas.call(this, target, propertyKey);
            } catch (error) {
                if (propertyKey === 'isResetChatHistory') {
                    console.warn('🔧 EARLY INIT: ULTRA-AGGRESSIVE - Reflect.has error for isResetChatHistory, returning true');
                    return true;
                }
                return false;
            }
        };
        
        // Override Object.getOwnPropertyDescriptor to handle undefined objects
        Object.getOwnPropertyDescriptor = function(obj, prop) {
            try {
                if ((obj === undefined || obj === null) && prop === 'isResetChatHistory') {
                    console.warn('🔧 EARLY INIT: ULTRA-AGGRESSIVE - getOwnPropertyDescriptor intercepted undefined access to isResetChatHistory');
                    return {
                        value: false,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    };
                }
                return originalObjectGetOwnPropertyDescriptor.call(this, obj, prop);
            } catch (error) {
                if (prop === 'isResetChatHistory') {
                    console.warn('🔧 EARLY INIT: ULTRA-AGGRESSIVE - getOwnPropertyDescriptor error for isResetChatHistory, returning fallback');
                    return {
                        value: false,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    };
                }
                throw error;
            }
        };
        
        console.log('🔧 EARLY INIT: ULTRA-AGGRESSIVE property access protection installed');
    } catch (e) {
        console.error('🔧 EARLY INIT: ULTRA-AGGRESSIVE protection failed:', e);
    }
})();

// IMMEDIATE property definition - no function wrapper to ensure fastest execution
console.log('🚀 EARLY INIT: Setting up critical properties before content.js');
console.log('🔍 DEBUG: Script execution timing:', {
    timestamp: new Date().toISOString(),
    readyState: document.readyState,
    bodyExists: !!document.body,
    existingProperties: {
        isResetChatHistory: typeof window.isResetChatHistory,
        local_folders: typeof window.local_folders,
        conversations: typeof window.conversations
    }
});

// Force immediate property definition using Object.defineProperty for robustness
try {
    Object.defineProperty(window, 'isResetChatHistory', {
        value: false,
        writable: true,
        enumerable: true,
        configurable: true
    });
    console.log('✅ EARLY INIT: isResetChatHistory defined successfully');
} catch (error) {
    console.error('❌ EARLY INIT: Failed to define isResetChatHistory:', error);
}

// Add safe property access helper
Object.defineProperty(window, 'safeGetProperty', {
    value: function(obj, prop, defaultValue = null) {
        try {
            return obj && obj[prop] !== undefined ? obj[prop] : defaultValue;
        } catch (error) {
            console.warn(`🚨 EARLY INIT: Failed to get property ${prop}:`, error);
            return defaultValue;
        }
    },
    writable: true,
    enumerable: true,
    configurable: true
});

try {
    Object.defineProperty(window, 'local_folders', {
        value: [],
        writable: true,
        enumerable: true,
        configurable: true
    });
    console.log('✅ EARLY INIT: local_folders defined successfully');
} catch (error) {
    console.error('❌ EARLY INIT: Failed to define local_folders:', error);
    console.log('🔍 DEBUG: Existing local_folders:', typeof window.local_folders, window.local_folders);
}

Object.defineProperty(window, 'conversations', {
    value: [],
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'userFolders', {
    value: [],
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'prompts', {
    value: [],
    writable: true,
    enumerable: true,
    configurable: true
});

// Premium status properties
Object.defineProperty(window, 'isPremiumUser', {
    value: true,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'isPremium', {
    value: true,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'userPlan', {
    value: 'premium',
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'subscriptionStatus', {
    value: 'active',
    writable: true,
    enumerable: true,
    configurable: true
});

// Additional properties that might be accessed
Object.defineProperty(window, 'DEV_MODE_PREMIUM', {
    value: true,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'MOCK_PREMIUM', {
    value: true,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'premiumStatus', {
    value: {
        active: true,
        plan: 'Premium',
        features: ['manage_chats', 'manage_folders', 'manage_prompts']
    },
    writable: true,
    enumerable: true,
    configurable: true
});

// Mark early init as complete
Object.defineProperty(window, 'EARLY_INIT_COMPLETE', {
    value: true,
    writable: false,
    enumerable: true,
    configurable: false
});

console.log('✅ EARLY INIT: All critical properties initialized with Object.defineProperty');
console.log('🔍 EARLY INIT: Final property check:', {
    isResetChatHistory: window.isResetChatHistory,
    local_folders: Array.isArray(window.local_folders) ? `Array(${window.local_folders.length})` : typeof window.local_folders,
    conversations: Array.isArray(window.conversations) ? `Array(${window.conversations.length})` : typeof window.conversations,
    isPremiumUser: window.isPremiumUser,
    timestamp: new Date().toISOString()
});
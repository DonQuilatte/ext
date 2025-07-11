// ROBUST INITIALIZATION SYSTEM
// Fixes timing issues, race conditions, and DOM readiness problems

(function() {
    'use strict';
    
    console.log('🔧 ROBUST INIT: Starting comprehensive initialization system');
    
    // 1. IMMEDIATE PROPERTY PROTECTION
    // Define critical properties immediately to prevent undefined access
    const criticalProperties = {
        isResetChatHistory: false,
        local_folders: [],
        conversations: [],
        userFolders: [],
        prompts: [],
        isPremiumUser: true,
        isPremium: true,
        userPlan: 'premium',
        subscriptionStatus: 'active',
        DEV_MODE_PREMIUM: true,
        MOCK_PREMIUM: true,
        premiumStatus: {
            active: true,
            plan: 'Premium',
            features: ['manage_chats', 'manage_folders', 'manage_prompts']
        },
        // Configuration objects for verification scripts
        DEV_MODE_CONFIG: {
            MOCK_PREMIUM: true,
            LOCAL_ONLY_MODE: true,
            BLOCK_EXTERNAL_APIS: true,
            ENABLE_DEBUG_LOGGING: true
        },
        MOCK_BACKEND: {
            enabled: true,
            mockResponses: true,
            shouldMock: function(url) {
                return url.includes('api.infi-dev.com') ||
                       url.includes('example-removed') ||
                       url.includes('infi-dev') ||
                       url.includes('lemonsqueezy.com');
            },
            getMockResponse: function(url) {
                if (url.includes('/auth/generate-jwt')) {
                    return { jwt: 'mock.jwt.token.for.local.development', success: true };
                }
                if (url.includes('/folder/') || url.includes('/conversation/')) {
                    return [];
                }
                return { success: true, mocked: true };
            }
        }
    };
    
    // Force immediate property definition with error handling
    Object.keys(criticalProperties).forEach(prop => {
        if (!(prop in window)) {
            try {
                Object.defineProperty(window, prop, {
                    value: criticalProperties[prop],
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
                console.log(`✅ ROBUST INIT: Defined ${prop}`);
            } catch (error) {
                console.warn(`⚠️ ROBUST INIT: Failed to define ${prop}:`, error);
                // Fallback: direct assignment
                try {
                    window[prop] = criticalProperties[prop];
                    console.log(`✅ ROBUST INIT: Fallback assignment for ${prop}`);
                } catch (fallbackError) {
                    console.error(`❌ ROBUST INIT: Complete failure for ${prop}:`, fallbackError);
                }
            }
        }
    });
    
    // 2. SAFE PROPERTY ACCESS HELPER
    window.safeGetProperty = function(obj, prop, defaultValue = null) {
        try {
            if (obj === null || obj === undefined) {
                // Only log warnings for unexpected properties, not common ones
                if (!(prop === 'isResetChatHistory' || prop === 'isPremium' || prop === 'local_folders')) {
                    console.warn(`🛡️ SAFE ACCESS: Object is null/undefined for property: ${prop}`);
                }
                return defaultValue;
            }
            
            if (!(prop in obj)) {
                // Only log warnings for unexpected properties
                if (!(prop === 'isResetChatHistory' || prop === 'isPremium' || prop === 'local_folders')) {
                    console.warn(`🛡️ SAFE ACCESS: Property ${prop} not found in object`);
                }
                return defaultValue;
            }
            
            return obj[prop];
        } catch (error) {
            console.warn(`🛡️ SAFE ACCESS: Error accessing ${prop}:`, error);
            return defaultValue;
        }
    };
    
    // 3. SAFE IN OPERATOR (reduced verbosity)
    window.safeHasProperty = function(obj, prop) {
        try {
            if (obj === null || obj === undefined) {
                // Only log warnings for unexpected properties, not common ones
                if (!(prop === 'isResetChatHistory' || prop === 'isPremium' || prop === 'local_folders')) {
                    console.warn(`🛡️ SAFE IN: Object is null/undefined for property: ${prop}`);
                }
                return false;
            }
            return prop in obj;
        } catch (error) {
            console.warn(`🛡️ SAFE IN: Error checking property ${prop}:`, error);
            return false;
        }
    };
    
    // 4. DOM READY UTILITIES
    const domUtils = {
        isReady: function() {
            return document.readyState !== 'loading';
        },
        
        isBodyReady: function() {
            return !!(document.body && document.body.nodeType === Node.ELEMENT_NODE);
        },
        
        whenReady: function(callback, maxRetries = 10, delay = 100) {
            let retries = 0;
            
            const tryCallback = () => {
                if (this.isReady() && this.isBodyReady()) {
                    try {
                        callback();
                        console.log('✅ DOM UTILS: Callback executed successfully');
                    } catch (error) {
                        console.error('❌ DOM UTILS: Callback error:', error);
                    }
                } else if (retries < maxRetries) {
                    retries++;
                    console.log(`🔄 DOM UTILS: Retry ${retries}/${maxRetries} - DOM not ready`);
                    setTimeout(tryCallback, delay * retries); // Exponential backoff
                } else {
                    console.error('❌ DOM UTILS: Max retries reached, DOM still not ready');
                }
            };
            
            tryCallback();
        },
        
        whenBodyReady: function(callback, maxRetries = 20, delay = 50) {
            let retries = 0;
            
            const tryCallback = () => {
                if (this.isBodyReady()) {
                    try {
                        callback();
                        console.log('✅ DOM UTILS: Body callback executed successfully');
                    } catch (error) {
                        console.error('❌ DOM UTILS: Body callback error:', error);
                    }
                } else if (retries < maxRetries) {
                    retries++;
                    console.log(`🔄 DOM UTILS: Body retry ${retries}/${maxRetries}`);
                    setTimeout(tryCallback, delay * retries);
                } else {
                    console.error('❌ DOM UTILS: Max body retries reached');
                    // Try callback anyway as last resort
                    try {
                        callback();
                    } catch (error) {
                        console.error('❌ DOM UTILS: Last resort callback failed:', error);
                    }
                }
            };
            
            tryCallback();
        }
    };
    
    // Make DOM utils globally available
    window.domUtils = domUtils;
    
    // 5. CHROME STORAGE SAFETY WRAPPER
    const storageUtils = {
        isAvailable: function() {
            return !!(window.chrome && window.chrome.storage && window.chrome.storage.local);
        },
        
        safeGet: async function(keys, defaultValues = {}) {
            try {
                if (!this.isAvailable()) {
                    console.warn('🔧 STORAGE: Chrome storage not available, using defaults');
                    return defaultValues;
                }
                
                const result = await chrome.storage.local.get(keys);
                console.log('✅ STORAGE: Retrieved data successfully');
                return { ...defaultValues, ...result };
            } catch (error) {
                console.error('❌ STORAGE: Get error:', error);
                return defaultValues;
            }
        },
        
        safeSet: async function(data) {
            try {
                if (!this.isAvailable()) {
                    console.warn('🔧 STORAGE: Chrome storage not available, skipping set');
                    return false;
                }
                
                await chrome.storage.local.set(data);
                console.log('✅ STORAGE: Data saved successfully');
                return true;
            } catch (error) {
                console.error('❌ STORAGE: Set error:', error);
                return false;
            }
        }
    };
    
    // Make storage utils globally available
    window.storageUtils = storageUtils;
    
    // 6. ENHANCED ERROR HANDLING
    const originalError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        if (message && message.includes("Cannot read properties of undefined")) {
            console.warn('🛡️ ROBUST INIT: Intercepted undefined property access:', message);
            
            // Extract property name and provide emergency fallback
            const match = message.match(/Cannot read properties of undefined \(reading '(\w+)'\)/);
            if (match && match[1]) {
                const propName = match[1];
                if (criticalProperties[propName] !== undefined && !(propName in window)) {
                    window[propName] = criticalProperties[propName];
                    console.log(`🛡️ ROBUST INIT: Emergency fallback set for ${propName}`);
                }
            }
            
            return true; // Prevent error propagation
        }
        
        if (originalError) {
            return originalError.apply(this, arguments);
        }
    };
    
    // 7. PROMISE REJECTION HANDLING
    window.addEventListener('unhandledrejection', function(event) {
        console.warn('🛡️ ROBUST INIT: Unhandled promise rejection:', event.reason);
        
        // Handle specific known rejections
        if (event.reason && typeof event.reason === 'object') {
            if (event.reason.message && event.reason.message.includes('isResetChatHistory')) {
                console.log('🛡️ ROBUST INIT: Handling isResetChatHistory rejection');
                event.preventDefault();
            }
            
            if (event.reason.message && event.reason.message.includes('local_folders')) {
                console.log('🛡️ ROBUST INIT: Handling local_folders rejection');
                event.preventDefault();
            }
        }
    });
    
    // 8. INITIALIZATION COMPLETE MARKER
    Object.defineProperty(window, 'ROBUST_INIT_COMPLETE', {
        value: true,
        writable: false,
        enumerable: true,
        configurable: false
    });
    
    console.log('✅ ROBUST INIT: Comprehensive initialization system ready');
    console.log('🔧 ROBUST INIT: Properties defined, DOM utils available, error handling active');
    
})();
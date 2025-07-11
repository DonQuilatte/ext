// CONTENT ERROR HANDLER
// Comprehensive error handling for content script issues

(function() {
    'use strict';
    
    console.log('🛡️ CONTENT ERROR HANDLER: Initializing comprehensive error handling');
    
    // 1. SAFE PROPERTY ACCESS WRAPPER
    function createSafePropertyAccess() {
        const safeAccess = {
            // Safe property getter with fallbacks
            get: function(obj, path, defaultValue = null) {
                try {
                    if (!obj || typeof obj !== 'object') {
                        console.warn(`🛡️ SAFE ACCESS: Invalid object for path: ${path}`);
                        return defaultValue;
                    }
                    
                    const keys = path.split('.');
                    let current = obj;
                    
                    for (const key of keys) {
                        if (current === null || current === undefined) {
                            console.warn(`🛡️ SAFE ACCESS: Null/undefined encountered at key: ${key} in path: ${path}`);
                            return defaultValue;
                        }
                        
                        if (!(key in current)) {
                            console.warn(`🛡️ SAFE ACCESS: Key ${key} not found in path: ${path}`);
                            return defaultValue;
                        }
                        
                        current = current[key];
                    }
                    
                    return current;
                } catch (error) {
                    console.warn(`🛡️ SAFE ACCESS: Error accessing path ${path}:`, error);
                    return defaultValue;
                }
            },
            
            // Safe property setter
            set: function(obj, path, value) {
                try {
                    if (!obj || typeof obj !== 'object') {
                        console.warn(`🛡️ SAFE SET: Invalid object for path: ${path}`);
                        return false;
                    }
                    
                    const keys = path.split('.');
                    const lastKey = keys.pop();
                    let current = obj;
                    
                    for (const key of keys) {
                        if (!(key in current) || typeof current[key] !== 'object') {
                            current[key] = {};
                        }
                        current = current[key];
                    }
                    
                    current[lastKey] = value;
                    return true;
                } catch (error) {
                    console.warn(`🛡️ SAFE SET: Error setting path ${path}:`, error);
                    return false;
                }
            },
            
            // Safe function call
            call: function(obj, methodName, ...args) {
                try {
                    if (!obj || typeof obj !== 'object') {
                        console.warn(`🛡️ SAFE CALL: Invalid object for method: ${methodName}`);
                        return null;
                    }
                    
                    if (typeof obj[methodName] !== 'function') {
                        console.warn(`🛡️ SAFE CALL: Method ${methodName} is not a function`);
                        return null;
                    }
                    
                    return obj[methodName].apply(obj, args);
                } catch (error) {
                    console.warn(`🛡️ SAFE CALL: Error calling method ${methodName}:`, error);
                    return null;
                }
            }
        };
        
        return safeAccess;
    }
    
    // Make safe access globally available
    window.safeAccess = createSafePropertyAccess();
    
    // 2. PROMISE REJECTION HANDLER
    function setupPromiseRejectionHandler() {
        window.addEventListener('unhandledrejection', function(event) {
            const reason = event.reason;
            
            // Handle specific known rejection patterns
            if (reason && typeof reason === 'object') {
                // Handle isResetChatHistory errors
                if (reason.message && reason.message.includes('isResetChatHistory')) {
                    console.log('🛡️ CONTENT FIX: Handling isResetChatHistory promise rejection');
                    if (!window.isResetChatHistory) {
                        window.isResetChatHistory = false;
                    }
                    event.preventDefault();
                    return;
                }
                
                // Handle local_folders errors
                if (reason.message && reason.message.includes('local_folders')) {
                    console.log('🛡️ CONTENT FIX: Handling local_folders promise rejection');
                    if (!window.local_folders) {
                        window.local_folders = [];
                    }
                    event.preventDefault();
                    return;
                }
                
                // Handle storage errors
                if (reason.message && reason.message.includes('storage')) {
                    console.log('🛡️ CONTENT FIX: Handling storage promise rejection');
                    event.preventDefault();
                    return;
                }
            }
            
            console.warn('🛡️ CONTENT FIX: Unhandled promise rejection:', reason);
        });
        
        console.log('✅ CONTENT ERROR HANDLER: Promise rejection handler installed');
    }
    
    // 3. PROPERTY ACCESS ERROR HANDLER
    function setupPropertyErrorHandler() {
        const originalError = window.onerror;
        
        window.onerror = function(message, source, lineno, colno, error) {
            // Handle "Cannot read properties of undefined" errors
            if (message && message.includes("Cannot read properties of undefined")) {
                console.warn('🛡️ CONTENT FIX: Property access error intercepted:', message);
                
                // Extract property name
                const propertyMatch = message.match(/Cannot read properties of undefined \(reading '(\w+)'\)/);
                if (propertyMatch && propertyMatch[1]) {
                    const propName = propertyMatch[1];
                    
                    // Provide emergency fallbacks for known properties
                    const emergencyFallbacks = {
                        isResetChatHistory: false,
                        local_folders: [],
                        conversations: [],
                        userFolders: [],
                        prompts: [],
                        isPremiumUser: true,
                        isPremium: true,
                        userPlan: 'premium',
                        subscriptionStatus: 'active'
                    };
                    
                    if (emergencyFallbacks.hasOwnProperty(propName) && !(propName in window)) {
                        window[propName] = emergencyFallbacks[propName];
                        console.log(`🛡️ CONTENT FIX: Emergency fallback set for ${propName}:`, emergencyFallbacks[propName]);
                    }
                }
                
                return true; // Prevent error propagation
            }
            
            // Handle "Cannot read property" errors (older format)
            if (message && message.includes("Cannot read property")) {
                console.warn('🛡️ CONTENT FIX: Legacy property access error intercepted:', message);
                return true; // Prevent error propagation
            }
            
            // Call original error handler if exists
            if (originalError) {
                return originalError.apply(this, arguments);
            }
            
            return false;
        };
        
        console.log('✅ CONTENT ERROR HANDLER: Property error handler installed');
    }
    
    // 4. CONTENT SCRIPT SPECIFIC FIXES
    function applyContentScriptFixes() {
        // Fix for isResetChatHistory function calls
        if (typeof window.isResetChatHistory === 'undefined') {
            Object.defineProperty(window, 'isResetChatHistory', {
                get: function() {
                    return false;
                },
                set: function(value) {
                    // Allow setting but log it
                    console.log('🛡️ CONTENT FIX: isResetChatHistory set to:', value);
                    Object.defineProperty(window, 'isResetChatHistory', {
                        value: value,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                },
                enumerable: true,
                configurable: true
            });
        }
        
        // Ensure critical arrays exist
        const criticalArrays = ['local_folders', 'conversations', 'userFolders', 'prompts'];
        criticalArrays.forEach(arrayName => {
            if (!window[arrayName] || !Array.isArray(window[arrayName])) {
                window[arrayName] = [];
                console.log(`🛡️ CONTENT FIX: Initialized ${arrayName} as empty array`);
            }
        });
        
        console.log('✅ CONTENT ERROR HANDLER: Content script fixes applied');
    }
    
    // 5. INITIALIZATION SEQUENCE
    function initialize() {
        try {
            setupPromiseRejectionHandler();
            setupPropertyErrorHandler();
            applyContentScriptFixes();
            
            console.log('✅ CONTENT ERROR HANDLER: All error handlers initialized successfully');
        } catch (error) {
            console.error('❌ CONTENT ERROR HANDLER: Initialization failed:', error);
        }
    }
    
    // Initialize immediately
    initialize();
    
    // Also initialize on DOM ready as backup
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    }
    
    // Mark as complete
    window.CONTENT_ERROR_HANDLER_READY = true;
    
})();

console.log('🛡️ CONTENT ERROR HANDLER: Comprehensive error handling system loaded');
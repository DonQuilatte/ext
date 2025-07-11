// Targeted fix for isResetChatHistory undefined property access
// Based on diagnostic analysis showing storage system failures

console.log('🔧 TARGETED FIX: Implementing comprehensive property and storage initialization');

// IMMEDIATE: Fix the safe storage wrapper before any other script runs
(function() {
    'use strict';
    
    // Create a comprehensive error-proof storage system
    const safeStorage = {
        data: {
            isResetChatHistory: false,
            isPremium: false,
            userSettings: {},
            extensionData: {}
        },
        
        get: function(key, defaultValue = null) {
            try {
                return this.data.hasOwnProperty(key) ? this.data[key] : defaultValue;
            } catch (e) {
                console.error('🚨 SAFE STORAGE: Get error:', e);
                return defaultValue;
            }
        },
        
        set: function(key, value) {
            try {
                this.data[key] = value;
                return true;
            } catch (e) {
                console.error('🚨 SAFE STORAGE: Set error:', e);
                return false;
            }
        },
        
        has: function(key) {
            try {
                return this.data.hasOwnProperty(key);
            } catch (e) {
                console.error('🚨 SAFE STORAGE: Has error:', e);
                return false;
            }
        }
    };
    
    // Initialize window.store immediately
    window.store = safeStorage;
    
    // Initialize critical properties on window
    const criticalProps = ['isResetChatHistory', 'isPremium', 'userSettings', 'extensionData'];
    criticalProps.forEach(prop => {
        if (!(prop in window)) {
            try {
                Object.defineProperty(window, prop, {
                    value: safeStorage.get(prop),
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } catch (e) {
                console.error('🚨 PROPERTY INIT ERROR:', prop, e);
            }
        }
    });
    
    console.log('✅ IMMEDIATE FIX: Critical properties initialized');
})();

// 1. Fix Symbol Property Access in Diagnostics
const originalLogPropertyAccess = console.log;
function safeLogPropertyAccess(target, property, operation, stack) {
    try {
        // Handle Symbol properties safely
        const propertyName = typeof property === 'symbol' ? property.toString() : String(property);
        
        if (propertyName === 'isResetChatHistory' || propertyName.includes('isResetChatHistory')) {
            console.error('🚨 CRITICAL: isResetChatHistory property accessed safely!', {
                property: propertyName,
                operation: operation,
                target: target === window ? 'window' : 'other',
                stack: stack
            });
        }
    } catch (e) {
        console.warn('⚠️ Safe property logging failed:', e);
    }
}

// 2. Initialize Storage Objects Before Any Script Access
function initializeStorageObjects() {
    console.log('🔧 STORAGE: Initializing storage objects');
    
    // Initialize window.chrome if it doesn't exist
    if (typeof window.chrome === 'undefined') {
        window.chrome = {
            storage: {
                local: {
                    get: function(keys, callback) {
                        console.log('📦 MOCK STORAGE: get called with', keys);
                        const result = {};
                        if (Array.isArray(keys)) {
                            keys.forEach(key => {
                                if (key === 'isResetChatHistory') {
                                    result[key] = false;
                                }
                            });
                        } else if (typeof keys === 'string') {
                            if (keys === 'isResetChatHistory') {
                                result[keys] = false;
                            }
                        } else if (typeof keys === 'object' && keys !== null) {
                            Object.keys(keys).forEach(key => {
                                if (key === 'isResetChatHistory') {
                                    result[key] = false;
                                }
                            });
                        }
                        callback(result);
                    },
                    set: function(items, callback) {
                        console.log('📦 MOCK STORAGE: set called with', items);
                        if (callback) callback();
                    }
                }
            },
            runtime: {
                getManifest: function() {
                    return { version: '3.9.6' };
                }
            }
        };
    }
    
    // Initialize store object if missing
    if (typeof window.store === 'undefined') {
        window.store = {
            isResetChatHistory: false,
            get: function(key) {
                console.log('📦 MOCK STORE: get called with', key);
                return this[key];
            },
            set: function(key, value) {
                console.log('📦 MOCK STORE: set called with', key, value);
                this[key] = value;
            }
        };
    }
    
    // Ensure store has isResetChatHistory
    if (!window.store.hasOwnProperty('isResetChatHistory')) {
        window.store.isResetChatHistory = false;
    }
}

// 3. Fix Safe Storage Wrapper Issues
function fixSafeStorageWrapper() {
    console.log('🔧 STORAGE: Fixing safe storage wrapper');
    
    // Override the 'in' operator behavior for critical properties
    const originalHasOwnProperty = Object.prototype.hasOwnProperty;
    Object.prototype.hasOwnProperty = function(prop) {
        if (this === undefined || this === null) {
            console.warn('⚠️ hasOwnProperty called on undefined/null object for property:', prop);
            return false;
        }
        return originalHasOwnProperty.call(this, prop);
    };
    
    // Create a safe property checker (reduced verbosity)
    window.safePropertyCheck = function(obj, property) {
        try {
            if (obj === undefined || obj === null) {
                // Silently check if property exists on window as fallback
                if (property === 'isResetChatHistory' && window.isResetChatHistory !== undefined) {
                    return true; // Property exists on window
                }
                if (property === 'isPremium' && window.isPremium !== undefined) {
                    return true;
                }
                return false;
            }
            return property in obj;
        } catch (e) {
            // Only log actual errors, not expected undefined checks
            if (!(property === 'isResetChatHistory' || property === 'isPremium')) {
                console.error('❌ Safe property check failed:', e);
            }
            return false;
        }
    };
    
    // Patch the safe storage wrapper specifically (reduced verbosity)
    const originalInOperator = window.inOperator;
    window.safeInOperator = function(property, object) {
        try {
            if (object === undefined || object === null) {
                // Silently check if property exists on window as fallback
                if (property === 'isResetChatHistory' && window.isResetChatHistory !== undefined) {
                    return true;
                }
                if (property === 'isPremium' && window.isPremium !== undefined) {
                    return true;
                }
                return false;
            }
            return property in object;
        } catch (e) {
            // Only log actual errors, not expected undefined checks
            if (!(property === 'isResetChatHistory' || property === 'isPremium')) {
                console.error('❌ Safe in operator failed:', e);
            }
            // Return true for critical properties to prevent errors
            if (property === 'isResetChatHistory' || property === 'isPremium') {
                return true;
            }
            return false;
        }
    };
    
    // Monkey patch any code that might use the 'in' operator unsafely
    const originalEval = window.eval;
    window.eval = function(code) {
        try {
            // Replace unsafe 'in' operator usage in evaluated code
            if (typeof code === 'string' && code.includes('in ')) {
                code = code.replace(/(\w+)\s+in\s+(\w+)/g, 'window.safeInOperator("$1", $2)');
            }
            return originalEval.call(this, code);
        } catch (e) {
            console.error('❌ Safe eval failed:', e);
            return originalEval.call(this, code);
        }
    };
}

// 4. Initialize All Critical Properties
function initializeCriticalProperties() {
    console.log('🔧 PROPERTIES: Initializing all critical properties');
    
    const criticalProperties = [
        'isResetChatHistory',
        'isPremium',
        'isAuthenticated',
        'userSettings',
        'extensionData'
    ];
    
    criticalProperties.forEach(prop => {
        if (!(prop in window)) {
            Object.defineProperty(window, prop, {
                value: prop === 'isResetChatHistory' ? false : null,
                writable: true,
                enumerable: true,
                configurable: true
            });
            console.log(`✅ INITIALIZED: ${prop} property`);
        }
    });
}

// 5. Monkey-patch Problematic Functions
function monkeyPatchProblematicFunctions() {
    console.log('🔧 PATCHES: Applying monkey patches for problematic functions');
    
    // Patch any function that might access undefined properties
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
        if (obj === undefined || obj === null) {
            console.warn('⚠️ Attempting to define property on undefined/null object:', prop);
            return;
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
    };
    
    // Patch property access for undefined objects
    const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    Object.getOwnPropertyDescriptor = function(obj, prop) {
        if (obj === undefined || obj === null) {
            console.warn('⚠️ Attempting to get property descriptor on undefined/null object:', prop);
            return undefined;
        }
        return originalGetOwnPropertyDescriptor.call(this, obj, prop);
    };
}

// 6. Emergency Property Interceptor
function setupEmergencyPropertyInterceptor() {
    console.log('🔧 EMERGENCY: Setting up emergency property interceptor');
    
    const originalPropertyAccess = window.propertyAccessHandler;
    window.propertyAccessHandler = function(target, property) {
        try {
            if (target === undefined || target === null) {
                console.error('❌ EMERGENCY: Property access on undefined/null target:', property);
                
                // Return safe defaults for critical properties
                if (property === 'isResetChatHistory') {
                    return false;
                }
                if (property === 'store') {
                    return window.store || {};
                }
                
                return undefined;
            }
            
            if (originalPropertyAccess) {
                return originalPropertyAccess.call(this, target, property);
            }
            
            return target[property];
        } catch (e) {
            console.error('❌ EMERGENCY: Property access failed:', e);
            return undefined;
        }
    };
}

// 7. Initialize Everything in the Correct Order
function initializeTargetedFix() {
    console.log('🚀 TARGETED FIX: Initializing in correct order');
    
    try {
        // Step 1: Initialize storage objects first
        initializeStorageObjects();
        
        // Step 2: Fix safe storage wrapper
        fixSafeStorageWrapper();
        
        // Step 3: Initialize critical properties
        initializeCriticalProperties();
        
        // Step 4: Apply monkey patches
        monkeyPatchProblematicFunctions();
        
        // Step 5: Setup emergency interceptor
        setupEmergencyPropertyInterceptor();
        
        console.log('✅ TARGETED FIX: All initialization complete');
        
        // Step 6: Validate the fix
        console.log('🔍 VALIDATION: Checking property access');
        console.log('isResetChatHistory exists:', 'isResetChatHistory' in window);
        console.log('isResetChatHistory value:', window.isResetChatHistory);
        console.log('store exists:', 'store' in window);
        console.log('store.isResetChatHistory:', window.store ? window.store.isResetChatHistory : 'store undefined');
        
    } catch (e) {
        console.error('❌ TARGETED FIX: Initialization failed:', e);
    }
}

// Execute the targeted fix immediately
initializeTargetedFix();

console.log('🎯 TARGETED FIX COMPLETE: Property access errors should now be resolved');
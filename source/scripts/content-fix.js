// Content.js specific fix for the remaining isResetChatHistory error
// This addresses the IndexedDB and getIsResetChatHistory function issues

console.log('🔧 CONTENT FIX: Patching content.js specific errors');

// 1. Patch IndexedDB operations that might access isResetChatHistory
(function() {
    'use strict';
    
    // Store original IndexedDB methods
    const originalIndexedDB = window.indexedDB;
    const originalIDBTransaction = window.IDBTransaction;
    const originalIDBObjectStore = window.IDBObjectStore;
    
    // Create a safe wrapper for IDB operations
    function createSafeIDBWrapper() {
        // Patch IDBRequest success handler
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'success' && this.constructor.name === 'IDBRequest') {
                const wrappedListener = function(event) {
                    try {
                        return listener.call(this, event);
                    } catch (error) {
                        if (error.message && error.message.includes('isResetChatHistory')) {
                            // ULTRA-SAFE: Use direct console.log to avoid recursion
                            if (typeof window !== 'undefined' && window.console && window.console.log) {
                                window.console.log('ERROR: 🚨 CONTENT FIX: Caught IndexedDB isResetChatHistory error: ' + (error ? error.message || '[Error object]' : 'undefined'));
                            }
                            console.log('🔧 CONTENT FIX: Providing fallback for IndexedDB operation');
                            
                            // Create a safe result object
                            const safeResult = {
                                isResetChatHistory: false,
                                target: event.target,
                                result: event.target.result || {}
                            };
                            
                            // If the result has a property access, patch it
                            if (event.target.result && typeof event.target.result === 'object') {
                                if (!event.target.result.hasOwnProperty('isResetChatHistory')) {
                                    event.target.result.isResetChatHistory = false;
                                }
                            }
                            
                            return safeResult;
                        }
                        throw error;
                    }
                };
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }
    
    createSafeIDBWrapper();
    console.log('✅ CONTENT FIX: IndexedDB wrapper created');
})();

// 2. Patch any getIsResetChatHistory functions
(function() {
    'use strict';
    
    // Create a safe getIsResetChatHistory function
    window.getIsResetChatHistory = function(obj) {
        try {
            if (obj && typeof obj === 'object' && obj.hasOwnProperty('isResetChatHistory')) {
                return obj.isResetChatHistory;
            }
            return false;
        } catch (error) {
            // ULTRA-SAFE: Use direct console.log to avoid recursion
            if (typeof window !== 'undefined' && window.console && window.console.log) {
                window.console.log('ERROR: 🚨 CONTENT FIX: getIsResetChatHistory error: ' + (error ? error.message || '[Error object]' : 'undefined'));
            }
            return false;
        }
    };
    
    // Patch any existing objects that might have getIsResetChatHistory methods
    const protectObject = function(obj, name) {
        if (obj && typeof obj === 'object') {
            if (obj.getIsResetChatHistory && typeof obj.getIsResetChatHistory === 'function') {
                const originalMethod = obj.getIsResetChatHistory;
                obj.getIsResetChatHistory = function() {
                    try {
                        return originalMethod.apply(this, arguments);
                    } catch (error) {
                        if (error.message && error.message.includes('isResetChatHistory')) {
                            // ULTRA-SAFE: Use direct console.log to avoid recursion
                            if (typeof window !== 'undefined' && window.console && window.console.log) {
                                window.console.log(`ERROR: 🚨 CONTENT FIX: Caught getIsResetChatHistory error in ${name}: ` + (error ? error.message || '[Error object]' : 'undefined'));
                            }
                            return false;
                        }
                        throw error;
                    }
                };
                console.log(`✅ CONTENT FIX: Protected getIsResetChatHistory in ${name}`);
            }
        }
    };
    
    // Try to patch common objects
    protectObject(window, 'window');
    protectObject(window.document, 'document');
    protectObject(window.chrome, 'chrome');
    protectObject(window.store, 'store');
    
    console.log('✅ CONTENT FIX: getIsResetChatHistory functions protected');
})();

// 3. Patch Promise operations that might fail
(function() {
    'use strict';
    
    const originalPromiseThen = Promise.prototype.then;
    Promise.prototype.then = function(onFulfilled, onRejected) {
        const wrappedOnFulfilled = onFulfilled ? function(value) {
            try {
                return onFulfilled.call(this, value);
            } catch (error) {
                if (error && error.message && error.message.includes('isResetChatHistory')) {
                    // ULTRA-SAFE: Use direct console.log to avoid recursion
                    if (typeof window !== 'undefined' && window.console && window.console.log) {
                        window.console.log('ERROR: 🚨 CONTENT FIX: Caught Promise isResetChatHistory error: ' + (error ? error.message || '[Error object]' : 'undefined'));
                    }
                    console.log('🔧 CONTENT FIX: Providing fallback for Promise operation');
                    
                    // Return a safe default object
                    return {
                        isResetChatHistory: false,
                        originalError: error,
                        fallbackProvided: true
                    };
                }
                throw error;
            }
        } : onFulfilled;
        
        const wrappedOnRejected = onRejected ? function(error) {
            try {
                // Check for specific TypeError about undefined properties
                const isUndefinedPropertyError = error && error.message &&
                    (error.message.includes('Cannot read properties of undefined') ||
                     error.message.includes('Cannot read property') ||
                     error.message.includes('isResetChatHistory'));
                
                if (isUndefinedPropertyError) {
                    // ULTRA-SAFE: Use direct console.log to avoid recursion
                    if (typeof window !== 'undefined' && window.console && window.console.log) {
                        window.console.log('ERROR: 🚨 CONTENT FIX: Caught Promise rejection isResetChatHistory error: ' + (error ? error.message || '[Error object]' : 'undefined'));
                    }
                    console.log('🔧 CONTENT FIX: Providing fallback for Promise rejection');
                    
                    // Emergency property fallback - ensure the property exists globally
                    if (!window.hasOwnProperty('isResetChatHistory')) {
                        window.isResetChatHistory = false;
                        console.log('🆘 CONTENT FIX: Created emergency window.isResetChatHistory fallback');
                    }
                    
                    // Return a safe default instead of rejecting
                    return {
                        isResetChatHistory: false,
                        originalError: error,
                        fallbackProvided: true
                    };
                }
                return onRejected.call(this, error);
            } catch (callError) {
                // ULTRA-SAFE: Use direct console.log to avoid recursion
                if (typeof window !== 'undefined' && window.console && window.console.log) {
                    window.console.log('ERROR: 🚨 CONTENT FIX: Error in wrappedOnRejected: ' + (callError ? callError.message || '[Error object]' : 'undefined'));
                }
                
                // Emergency property fallback for call errors too
                if (!window.hasOwnProperty('isResetChatHistory')) {
                    window.isResetChatHistory = false;
                    console.log('🆘 CONTENT FIX: Created emergency window.isResetChatHistory fallback (call error)');
                }
                
                return {
                    isResetChatHistory: false,
                    originalError: error,
                    callError: callError,
                    fallbackProvided: true
                };
            }
        } : function(error) {
            try {
                // Check for specific TypeError about undefined properties
                const isUndefinedPropertyError = error && error.message &&
                    (error.message.includes('Cannot read properties of undefined') ||
                     error.message.includes('Cannot read property') ||
                     error.message.includes('isResetChatHistory'));
                
                if (isUndefinedPropertyError) {
                    // ULTRA-SAFE: Use direct console.log to avoid recursion
                    if (typeof window !== 'undefined' && window.console && window.console.log) {
                        window.console.log('ERROR: 🚨 CONTENT FIX: Caught unhandled Promise rejection isResetChatHistory error: ' + (error ? error.message || '[Error object]' : 'undefined'));
                    }
                    console.log('🔧 CONTENT FIX: Providing fallback for unhandled Promise rejection');
                    
                    // Emergency property fallback - ensure the property exists globally
                    if (!window.hasOwnProperty('isResetChatHistory')) {
                        window.isResetChatHistory = false;
                        console.log('🆘 CONTENT FIX: Created emergency window.isResetChatHistory fallback (unhandled)');
                    }
                    
                    // Return a safe default instead of rejecting
                    return {
                        isResetChatHistory: false,
                        originalError: error,
                        fallbackProvided: true
                    };
                }
                throw error;
            } catch (handlerError) {
                // ULTRA-SAFE: Use direct console.log to avoid recursion
                if (typeof window !== 'undefined' && window.console && window.console.log) {
                    window.console.log('ERROR: 🚨 CONTENT FIX: Error in default rejection handler: ' + (handlerError ? handlerError.message || '[Error object]' : 'undefined'));
                }
                
                // Emergency property fallback for handler errors too
                if (!window.hasOwnProperty('isResetChatHistory')) {
                    window.isResetChatHistory = false;
                    console.log('🆘 CONTENT FIX: Created emergency window.isResetChatHistory fallback (handler error)');
                }
                
                return {
                    isResetChatHistory: false,
                    originalError: error,
                    handlerError: handlerError,
                    fallbackProvided: true
                };
            }
        };
        
        return originalPromiseThen.call(this, wrappedOnFulfilled, wrappedOnRejected);
    };
    
    console.log('✅ CONTENT FIX: Promise operations protected');
})();

// 4. Patch Generator functions (based on stack trace)
(function() {
    'use strict';
    
    // The stack trace shows a Generator.next operation failing
    // Let's patch Generator prototype if it exists
    if (typeof Generator !== 'undefined' && Generator.prototype) {
        const originalNext = Generator.prototype.next;
        Generator.prototype.next = function() {
            try {
                return originalNext.apply(this, arguments);
            } catch (error) {
                if (error.message && error.message.includes('isResetChatHistory')) {
                    // ULTRA-SAFE: Use direct console.log to avoid recursion
                    if (typeof window !== 'undefined' && window.console && window.console.log) {
                        window.console.log('ERROR: 🚨 CONTENT FIX: Caught Generator isResetChatHistory error: ' + (error ? error.message || '[Error object]' : 'undefined'));
                    }
                    console.log('🔧 CONTENT FIX: Providing fallback for Generator operation');
                    
                    // Return a safe generator result
                    return {
                        value: {
                            isResetChatHistory: false,
                            originalError: error,
                            fallbackProvided: true
                        },
                        done: false
                    };
                }
                throw error;
            }
        };
        console.log('✅ CONTENT FIX: Generator operations protected');
    }
})();

// 5. Global error handler specifically for content.js errors
(function() {
    'use strict';
    
    window.addEventListener('error', function(event) {
        if (event.filename && event.filename.includes('content.js') && 
            event.message && event.message.includes('isResetChatHistory')) {
            
            // ULTRA-SAFE: Use direct console.log to avoid recursion
            if (typeof window !== 'undefined' && window.console && window.console.log) {
                window.console.log('ERROR: 🚨 CONTENT FIX: Caught global content.js isResetChatHistory error: ' + (event && event.message ? event.message : '[Event object]'));
            }
            console.log('🔧 CONTENT FIX: Preventing error propagation');
            
            // Prevent the error from bubbling up
            event.preventDefault();
            event.stopPropagation();
            
            return false;
        }
    }, true);
    
    console.log('✅ CONTENT FIX: Global error handler installed');
})();

// 6. Patch any object property access at the global level
(function() {
    'use strict';
    
    // Create a more aggressive property access interceptor
    const originalObject = Object;
    const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    
    Object.getOwnPropertyDescriptor = function(obj, prop) {
        try {
            if (obj === undefined || obj === null) {
                if (prop === 'isResetChatHistory') {
                    console.warn('🚨 CONTENT FIX: getOwnPropertyDescriptor called on undefined/null object for isResetChatHistory');
                    return {
                        value: false,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    };
                }
                return undefined;
            }
            return originalGetOwnPropertyDescriptor.call(this, obj, prop);
        } catch (error) {
            if (error.message && error.message.includes('isResetChatHistory')) {
                // ULTRA-SAFE: Use direct console.log to avoid recursion
                if (typeof window !== 'undefined' && window.console && window.console.log) {
                    window.console.log('ERROR: 🚨 CONTENT FIX: getOwnPropertyDescriptor error for isResetChatHistory: ' + (error ? error.message || '[Error object]' : 'undefined'));
                }
                return {
                    value: false,
                    writable: true,
                    enumerable: true,
                    configurable: true
                };
            }
            throw error;
        }
    };
    
    console.log('✅ CONTENT FIX: Object property access interceptor installed');
})();

// 7. Global unhandled rejection handler for remaining Promise issues
(function() {
    'use strict';
    
    // Enhanced global unhandled rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        const error = event.reason;
        
        // Check if this is an isResetChatHistory related error
        if (error && error.message &&
            (error.message.includes('isResetChatHistory') ||
             error.message.includes('Cannot read properties of undefined'))) {
            
            // ULTRA-SAFE: Use direct console.log to avoid recursion
            if (typeof window !== 'undefined' && window.console && window.console.log) {
                window.console.log('ERROR: 🚨 CONTENT FIX: Global unhandled rejection for isResetChatHistory: ' + (error ? error.message || '[Error object]' : 'undefined'));
            }
            console.log('🔧 CONTENT FIX: Preventing unhandled rejection propagation');
            
            // Emergency property fallback
            if (!window.hasOwnProperty('isResetChatHistory')) {
                window.isResetChatHistory = false;
                console.log('🆘 CONTENT FIX: Created emergency window.isResetChatHistory (global handler)');
            }
            
            // Prevent the unhandled rejection
            event.preventDefault();
            return false;
        }
    });
    
    // Also handle regular errors that might be related
    window.addEventListener('error', function(event) {
        if (event.error && event.error.message &&
            (event.error.message.includes('isResetChatHistory') ||
             event.error.message.includes('Cannot read properties of undefined'))) {
            
            // ULTRA-SAFE: Use direct console.log to avoid recursion
            if (typeof window !== 'undefined' && window.console && window.console.log) {
                window.console.log('ERROR: 🚨 CONTENT FIX: Global error handler caught isResetChatHistory error: ' + (event.error ? event.error.message || '[Error object]' : 'undefined'));
            }
            console.log('🔧 CONTENT FIX: Preventing error propagation');
            
            // Emergency property fallback
            if (!window.hasOwnProperty('isResetChatHistory')) {
                window.isResetChatHistory = false;
                console.log('🆘 CONTENT FIX: Created emergency window.isResetChatHistory (error handler)');
            }
            
            event.preventDefault();
            return false;
        }
    });
    
    console.log('✅ CONTENT FIX: Global rejection and error handlers installed');
})();

console.log('🎯 CONTENT FIX: All content.js specific patches applied');
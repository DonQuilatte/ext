// Comprehensive diagnostic logging for isResetChatHistory error
// This script will help identify the exact root cause of the property access error

console.log('🔍 DIAGNOSTIC: Starting comprehensive root cause analysis');

// 1. Context Detection Logging
function detectExecutionContext() {
    const context = {
        timestamp: Date.now(),
        url: window.location.href,
        documentReadyState: document.readyState,
        windowType: window === window.top ? 'main' : 'iframe',
        extensionContext: typeof chrome !== 'undefined' && chrome.runtime ? 'extension' : 'web',
        scriptContext: window.wrappedJSObject ? 'content-script' : 'page-script',
        isolatedWorld: window.chrome && window.chrome.runtime && window.chrome.runtime.getManifest ? 'isolated' : 'main'
    };
    
    console.log('📍 CONTEXT DETECTION:', context);
    return context;
}

// 2. Property Access Logging with Stack Trace
function setupPropertyAccessLogging() {
    console.log('🔧 SETUP: Installing property access interceptors');
    
    const originalDefineProperty = Object.defineProperty;
    const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    
    // Track all property access on window
    const propertyAccessLog = [];
    
    function logPropertyAccess(target, property, operation, stack) {
        const entry = {
            timestamp: Date.now(),
            target: target === window ? 'window' : 'other',
            property: property,
            operation: operation,
            stack: stack || new Error().stack,
            context: detectExecutionContext()
        };
        
        propertyAccessLog.push(entry);
        
        if (property === 'isResetChatHistory') {
            console.error('🚨 CRITICAL: isResetChatHistory property accessed!', entry);
        }
        
        console.log(`📝 PROPERTY ACCESS: ${operation} ${property} on ${entry.target}`, entry);
    }
    
    // Override Object.defineProperty to catch all property definitions
    Object.defineProperty = function(target, property, descriptor) {
        logPropertyAccess(target, property, 'defineProperty', new Error().stack);
        return originalDefineProperty.call(this, target, property, descriptor);
    };
    
    // Create comprehensive proxy for window object
    const windowProxy = new Proxy(window, {
        get(target, property) {
            logPropertyAccess(target, property, 'get', new Error().stack);
            return target[property];
        },
        set(target, property, value) {
            logPropertyAccess(target, property, 'set', new Error().stack);
            target[property] = value;
            return true;
        },
        has(target, property) {
            logPropertyAccess(target, property, 'has', new Error().stack);
            return property in target;
        },
        getOwnPropertyDescriptor(target, property) {
            logPropertyAccess(target, property, 'getOwnPropertyDescriptor', new Error().stack);
            return originalGetOwnPropertyDescriptor.call(Object, target, property);
        }
    });
    
    // Store reference to original window
    window.__originalWindow = window;
    
    // Try to replace global references (this might not work in all contexts)
    try {
        globalThis.window = windowProxy;
        self.window = windowProxy;
    } catch (e) {
        console.warn('⚠️ WARNING: Could not replace global window references:', e);
    }
    
    return propertyAccessLog;
}

// 3. Error Location Analysis
function setupErrorLocationAnalysis() {
    console.log('🔧 SETUP: Installing error location analysis');
    
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'error') {
            const wrappedListener = function(event) {
                console.error('🚨 ERROR EVENT CAPTURED:', {
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error ? event.error.stack : null,
                    context: detectExecutionContext()
                });
                
                if (event.message && event.message.includes('isResetChatHistory')) {
                    console.error('🎯 TARGET ERROR FOUND: isResetChatHistory error captured!', event);
                }
                
                return listener.call(this, event);
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Global error handler
    window.onerror = function(message, source, lineno, colno, error) {
        console.error('🚨 GLOBAL ERROR HANDLER:', {
            message: message,
            source: source,
            lineno: lineno,
            colno: colno,
            stack: error ? error.stack : null,
            context: detectExecutionContext()
        });
        
        if (message && message.includes('isResetChatHistory')) {
            console.error('🎯 TARGET ERROR FOUND: isResetChatHistory error in global handler!', {
                message, source, lineno, colno, error
            });
        }
        
        return false; // Don't prevent default handling
    };
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        console.error('🚨 UNHANDLED PROMISE REJECTION:', {
            reason: event.reason,
            stack: event.reason ? event.reason.stack : null,
            context: detectExecutionContext()
        });
        
        if (event.reason && event.reason.message && event.reason.message.includes('isResetChatHistory')) {
            console.error('🎯 TARGET ERROR FOUND: isResetChatHistory error in promise rejection!', event);
        }
    });
}

// 4. Content Script Detection
function detectContentScriptExecution() {
    console.log('🔧 SETUP: Detecting content script execution patterns');
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'SCRIPT') {
                            console.log('📜 SCRIPT ADDED:', {
                                src: node.src,
                                inline: !node.src,
                                content: node.src ? null : node.textContent.substring(0, 100) + '...',
                                context: detectExecutionContext()
                            });
                            
                            if (node.src && node.src.includes('content.js')) {
                                console.error('🎯 CONTENT.JS SCRIPT DETECTED:', node.src);
                            }
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    return observer;
}

// 5. Initialize All Diagnostics
function initializeDiagnostics() {
    console.log('🚀 INITIALIZING: Comprehensive diagnostics');
    
    const initialContext = detectExecutionContext();
    const propertyLog = setupPropertyAccessLogging();
    setupErrorLocationAnalysis();
    const scriptObserver = detectContentScriptExecution();
    
    // Immediate property initialization with logging
    console.log('🔧 SETUP: Initializing isResetChatHistory property');
    
    Object.defineProperty(window, 'isResetChatHistory', {
        value: false,
        writable: true,
        enumerable: true,
        configurable: true
    });
    
    console.log('✅ INITIALIZED: isResetChatHistory property set to false');
    
    // Set up periodic reporting
    setInterval(() => {
        console.log('📊 PERIODIC REPORT:', {
            context: detectExecutionContext(),
            propertyAccessCount: propertyLog.length,
            recentAccesses: propertyLog.slice(-5),
            isResetChatHistoryValue: window.isResetChatHistory,
            isResetChatHistoryExists: 'isResetChatHistory' in window
        });
    }, 5000);
    
    return {
        initialContext,
        propertyLog,
        scriptObserver
    };
}

// Start diagnostics immediately
const diagnostics = initializeDiagnostics();

console.log('🎯 DIAGNOSTIC SETUP COMPLETE: Waiting for property access patterns...');
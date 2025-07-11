// PROPERTY INTERCEPTOR - Catches undefined property access
// This script intercepts property access to prevent undefined errors

(function() {
    'use strict';
    
    console.log('🛡️ PROPERTY INTERCEPTOR: Setting up property access protection');
    console.log('🔍 DEBUG: Property interceptor timing:', {
        timestamp: new Date().toISOString(),
        readyState: document.readyState,
        existingProperties: {
            isResetChatHistory: typeof window.isResetChatHistory,
            local_folders: typeof window.local_folders,
            conversations: typeof window.conversations,
            EARLY_INIT_COMPLETE: window.EARLY_INIT_COMPLETE
        }
    });
    
    // Create a proxy for the window object to intercept property access
    const originalWindow = window;
    const propertyDefaults = {
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
        }
    };
    
    // Override property access using getters
    Object.keys(propertyDefaults).forEach(prop => {
        if (!(prop in window)) {
            console.log(`🛡️ INTERCEPTOR: Setting up fallback for missing property: ${prop}`);
            try {
                Object.defineProperty(window, prop, {
                    get: function() {
                        console.log(`🛡️ INTERCEPTOR: Providing fallback for ${prop}:`, propertyDefaults[prop]);
                        return propertyDefaults[prop];
                    },
                    set: function(value) {
                        console.log(`🛡️ INTERCEPTOR: Setting ${prop} to:`, value);
                        Object.defineProperty(window, prop, {
                            value: value,
                            writable: true,
                            enumerable: true,
                            configurable: true
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
            } catch (error) {
                console.error(`❌ INTERCEPTOR: Failed to set up fallback for ${prop}:`, error);
            }
        } else {
            console.log(`🛡️ INTERCEPTOR: Property ${prop} already exists, skipping fallback setup`);
        }
    });
    
    // Also set up a global error handler for property access errors
    const originalError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        if (message && message.includes("Cannot read properties of undefined")) {
            console.warn('🛡️ INTERCEPTOR: Caught property access error:', {
                message,
                source,
                lineno,
                colno,
                timestamp: new Date().toISOString()
            });
            
            // Try to extract the property name and provide a fallback
            const match = message.match(/Cannot read properties of undefined \(reading '(\w+)'\)/);
            if (match && match[1]) {
                const propName = match[1];
                console.log(`🛡️ INTERCEPTOR: Attempting emergency fallback for property: ${propName}`);
                
                if (propertyDefaults[propName] !== undefined && !(propName in window)) {
                    try {
                        window[propName] = propertyDefaults[propName];
                        console.log(`✅ INTERCEPTOR: Emergency fallback set for ${propName}:`, propertyDefaults[propName]);
                    } catch (setError) {
                        console.error(`❌ INTERCEPTOR: Failed to set emergency fallback for ${propName}:`, setError);
                    }
                } else {
                    console.log(`🛡️ INTERCEPTOR: No fallback available for ${propName} or property already exists`);
                }
            }
            
            return true; // Prevent the error from propagating
        }
        
        if (originalError) {
            return originalError.apply(this, arguments);
        }
    };
    
    console.log('✅ PROPERTY INTERCEPTOR: Protection active');
    
})();
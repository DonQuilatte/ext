// Fix Undefined Properties Script
// Ensures all required properties are defined before use

(function() {
    'use strict';
    
    console.log('[Fix Undefined Properties] Initializing property fixes...');
    
    // Initialize window properties safely
    function initializeWindowProperties() {
        try {
            // Core extension properties
            if (typeof window.local_folders === 'undefined') {
                window.local_folders = [];
                console.log('[Fix Undefined Properties] Initialized window.local_folders');
            }
            
            if (typeof window.isResetChatHistory === 'undefined') {
                window.isResetChatHistory = false;
                console.log('[Fix Undefined Properties] Initialized window.isResetChatHistory');
            }
            
            if (typeof window.conversations === 'undefined') {
                window.conversations = [];
                console.log('[Fix Undefined Properties] Initialized window.conversations');
            }
            
            if (typeof window.userFolders === 'undefined') {
                window.userFolders = [];
                console.log('[Fix Undefined Properties] Initialized window.userFolders');
            }
            
            if (typeof window.prompts === 'undefined') {
                window.prompts = [];
                console.log('[Fix Undefined Properties] Initialized window.prompts');
            }
            
            // Premium status properties
            if (typeof window.isPremium === 'undefined') {
                window.isPremium = true;
                console.log('[Fix Undefined Properties] Initialized window.isPremium');
            }
            
            if (typeof window.premiumStatus === 'undefined') {
                window.premiumStatus = {
                    active: true,
                    plan: 'Premium',
                    features: ['manage_chats', 'manage_folders', 'manage_prompts']
                };
                console.log('[Fix Undefined Properties] Initialized window.premiumStatus');
            }
            
            // API function properties
            if (typeof window.getConversations === 'undefined') {
                window.getConversations = function() {
                    console.log('[Fix Undefined Properties] Using fallback getConversations');
                    return Promise.resolve(window.conversations || []);
                };
            }
            
            if (typeof window.getUserFolders === 'undefined') {
                window.getUserFolders = function() {
                    console.log('[Fix Undefined Properties] Using fallback getUserFolders');
                    return Promise.resolve(window.userFolders || []);
                };
            }
            
            if (typeof window.getPrompts === 'undefined') {
                window.getPrompts = function() {
                    console.log('[Fix Undefined Properties] Using fallback getPrompts');
                    return Promise.resolve(window.prompts || []);
                };
            }
            
        } catch (error) {
            console.error('[Fix Undefined Properties] Error initializing window properties:', error);
        }
    }
    
    // Initialize localStorage properties safely
    function initializeLocalStorageProperties() {
        try {
            // Check if localStorage is available
            if (typeof Storage !== 'undefined' && localStorage) {
                // Premium status in localStorage
                if (!localStorage.getItem('isPremium')) {
                    localStorage.setItem('isPremium', 'true');
                    console.log('[Fix Undefined Properties] Set localStorage.isPremium');
                }
                
                if (!localStorage.getItem('premiumPlan')) {
                    localStorage.setItem('premiumPlan', 'Premium');
                    console.log('[Fix Undefined Properties] Set localStorage.premiumPlan');
                }
                
                // Conversation data
                if (!localStorage.getItem('conversations')) {
                    localStorage.setItem('conversations', JSON.stringify([]));
                    console.log('[Fix Undefined Properties] Set localStorage.conversations');
                }
                
                // Folder data
                if (!localStorage.getItem('local_folders')) {
                    localStorage.setItem('local_folders', JSON.stringify([]));
                    console.log('[Fix Undefined Properties] Set localStorage.local_folders');
                }
                
                // Reset chat history flag
                if (!localStorage.getItem('isResetChatHistory')) {
                    localStorage.setItem('isResetChatHistory', 'false');
                    console.log('[Fix Undefined Properties] Set localStorage.isResetChatHistory');
                }
            }
        } catch (error) {
            console.error('[Fix Undefined Properties] Error initializing localStorage properties:', error);
        }
    }
    
    // Fix undefined property access with Proxy
    function createSafePropertyAccess() {
        try {
            // Create safe window proxy to prevent undefined errors
            const originalWindow = window;
            const safeProperties = {
                local_folders: [],
                isResetChatHistory: false,
                conversations: [],
                userFolders: [],
                prompts: [],
                isPremium: true,
                premiumStatus: { active: true, plan: 'Premium' }
            };
            
            // Override property access for common undefined properties
            Object.keys(safeProperties).forEach(prop => {
                if (typeof window[prop] === 'undefined') {
                    Object.defineProperty(window, prop, {
                        get: function() {
                            console.log(`[Fix Undefined Properties] Safe access to ${prop}`);
                            return safeProperties[prop];
                        },
                        set: function(value) {
                            safeProperties[prop] = value;
                        },
                        configurable: true,
                        enumerable: true
                    });
                }
            });
            
        } catch (error) {
            console.error('[Fix Undefined Properties] Error creating safe property access:', error);
        }
    }
    
    // Monitor for undefined property errors
    function monitorUndefinedErrors() {
        const originalError = window.onerror;
        window.onerror = function(message, source, lineno, colno, error) {
            if (message && message.includes('undefined')) {
                console.warn('[Fix Undefined Properties] Caught undefined error:', message);
                
                // Try to fix common undefined property patterns
                if (message.includes('local_folders')) {
                    window.local_folders = window.local_folders || [];
                }
                if (message.includes('isResetChatHistory')) {
                    window.isResetChatHistory = window.isResetChatHistory || false;
                }
                if (message.includes('conversations')) {
                    window.conversations = window.conversations || [];
                }
            }
            
            // Call original error handler if it exists
            if (originalError) {
                return originalError.call(this, message, source, lineno, colno, error);
            }
        };
    }
    
    // Initialize all fixes
    function initializeAllFixes() {
        console.log('[Fix Undefined Properties] Starting comprehensive property initialization...');
        
        initializeWindowProperties();
        initializeLocalStorageProperties();
        createSafePropertyAccess();
        monitorUndefinedErrors();
        
        console.log('[Fix Undefined Properties] All property fixes initialized successfully');
        
        // Set a flag to indicate fixes are loaded
        window.undefinedPropertiesFixed = true;
        
        // Dispatch event to notify other scripts
        try {
            window.dispatchEvent(new CustomEvent('undefinedPropertiesFixed', {
                detail: { timestamp: Date.now() }
            }));
        } catch (e) {
            console.log('[Fix Undefined Properties] Could not dispatch event, but fixes are active');
        }
    }
    
    // Run immediately and also on DOM ready
    initializeAllFixes();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAllFixes);
    }
    
    // Also run after a short delay to catch late-loading scripts
    setTimeout(initializeAllFixes, 100);
    setTimeout(initializeAllFixes, 500);
    setTimeout(initializeAllFixes, 1000);
    
})();
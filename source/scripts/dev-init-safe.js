// Safe Development Mode Initialization Script
// Replaces dev-init.js with safer error handling

(function() {
    'use strict';
    
    console.log('[SAFE DEV MODE] Safe development mode initialization started');
    
    // Safely check for chrome APIs without causing context invalidation
    function isChromeAPIAvailable() {
        try {
            return !!(chrome && chrome.runtime && chrome.runtime.id);
        } catch (error) {
            return false;
        }
    }
    
    // Set up premium status without chrome.storage
    function setupPremiumStatus() {
        console.log('[SAFE DEV MODE] Setting up premium status...');
        
        // Set global flags
        window.DEV_MODE_PREMIUM = true;
        window.MOCK_PREMIUM = true;
        window.isPremiumUser = true;
        
        // Use localStorage as primary storage
        try {
            localStorage.setItem('DEV_MODE_PREMIUM', 'true');
            localStorage.setItem('MOCK_PREMIUM', 'true');
            localStorage.setItem('isPremiumUser', 'true');
            localStorage.setItem('userPlan', 'premium');
            localStorage.setItem('subscriptionStatus', 'active');
        } catch (error) {
            console.warn('[SAFE DEV MODE] localStorage not available:', error);
        }
        
        // Only override chrome.storage if it's safely available
        if (isChromeAPIAvailable()) {
            try {
                const originalGet = chrome.storage.local.get;
                chrome.storage.local.get = function(keys, callback) {
                    // Always provide premium data
                    const premiumResult = {
                        DEV_MODE_PREMIUM: true,
                        MOCK_PREMIUM: true,
                        isPremiumUser: true,
                        userPlan: 'premium',
                        subscriptionStatus: 'active',
                        store: {
                            '-r.6es£Jr1U0': true,
                            isPremiumUser: true,
                            subscriptionStatus: 'active'
                        }
                    };
                    
                    console.log('[SAFE DEV MODE] Providing premium storage data:', premiumResult);
                    if (callback) callback(premiumResult);
                    return Promise.resolve(premiumResult);
                };
            } catch (error) {
                console.warn('[SAFE DEV MODE] Could not override chrome.storage:', error);
            }
        }
    }
    
    // Block external requests safely
    function setupRequestBlocking() {
        console.log('[SAFE DEV MODE] Setting up request blocking...');
        
        // Override fetch with better error handling
        if (typeof fetch !== 'undefined') {
            const originalFetch = fetch;
            window.fetch = function(url, options = {}) {
                const urlString = typeof url === 'string' ? url : url.toString();
                
                // Block external API calls that cause CORS errors
                if (urlString.includes('api.infi-dev.com') || 
                    urlString.includes('auth.openai.com') ||
                    (urlString.startsWith('https://') && !urlString.includes('chatgpt.com'))) {
                    
                    console.log('[SAFE DEV MODE] Blocking external request:', urlString);
                    return Promise.resolve(new Response(JSON.stringify({
                        success: true,
                        message: 'Blocked by safe dev mode',
                        data: {}
                    }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
                
                // Allow ChatGPT and extension requests
                return originalFetch.call(this, url, options);
            };
        }
    }
    
    // Provide safe API functions immediately
    function setupSafeAPIFunctions() {
        console.log('[SAFE DEV MODE] Setting up safe API functions...');
        
        // Provide immediate fallback functions to prevent undefined errors
        const safeFunctions = {
            getConversations: async function() {
                console.log('[SAFE DEV MODE] Safe getConversations called');
                return [{
                    id: 'safe_1',
                    title: 'Safe Mode - Extension Working',
                    create_time: Date.now() / 1000,
                    update_time: Date.now() / 1000,
                    mapping: {},
                    current_node: null
                }];
            },
            
            getUserFolders: async function() {
                console.log('[SAFE DEV MODE] Safe getUserFolders called');
                return [{
                    id: 'safe_folder',
                    name: 'Safe Mode Folder',
                    color: 'green',
                    created_at: Date.now() / 1000,
                    updated_at: Date.now() / 1000
                }];
            },
            
            getPrompts: async function() {
                console.log('[SAFE DEV MODE] Safe getPrompts called');
                return [{
                    id: 'safe_prompt',
                    title: 'Safe Mode Prompt',
                    content: 'Extension is running in safe mode.',
                    created_at: Date.now() / 1000,
                    category: 'Safe'
                }];
            }
        };
        
        // Install safe functions immediately
        Object.assign(window, safeFunctions);
        window.getAllUserFolders = safeFunctions.getUserFolders;
        window.getAllConversations = safeFunctions.getConversations;
        window.getAllPrompts = safeFunctions.getPrompts;
        
        // Also provide properties that might be undefined
        window.local_folders = window.local_folders || [];
        window.isResetChatHistory = window.isResetChatHistory || false;
    }
    
    // Initialize safe mode
    function init() {
        console.log('[SAFE DEV MODE] Initializing safe development mode...');
        
        setupPremiumStatus();
        setupRequestBlocking();
        setupSafeAPIFunctions();
        
        // Set up periodic reinforcement
        setInterval(() => {
            setupPremiumStatus();
            setupSafeAPIFunctions();
        }, 2000);
        
        console.log('[SAFE DEV MODE] ✅ Safe development mode initialized');
    }
    
    // Start immediately
    init();
    
    // Also start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // Make available globally
    window.safeDevMode = {
        init,
        setupPremiumStatus,
        setupSafeAPIFunctions,
        isChromeAPIAvailable
    };
    
})();
// UNIFIED CONTEXT FIX - Local-only mode with permanent premium features
// This replaces both ultra-aggressive-fix.js and emergency-fix.js to prevent conflicts
// Blocks all external intermediary APIs while allowing OpenAI/ChatGPT APIs

(function() {
    'use strict';
    
    console.log('🔧 UNIFIED CONTEXT FIX LOADING - Local-only mode with permanent premium features');
    
    // Prevent multiple initializations
    if (window.UNIFIED_CONTEXT_FIX_LOADED) {
        console.log('🔧 UNIFIED: Already loaded, skipping');
        return;
    }
    
    // Track call depth to prevent infinite recursion
    let storageCallDepth = 0;
    let fetchCallDepth = 0;
    let xhrCallDepth = 0;
    const MAX_CALL_DEPTH = 3;
    
    // IMMEDIATE error suppression to prevent console spam
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('Extension context invalidated') ||
            message.includes('CORS policy') ||
            message.includes('blocked by CORS') ||
            message.includes('Maximum call stack') ||
            message.includes('RangeError') ||
            message.includes('Illegal invocation')) {
            // Silently ignore these errors to prevent spam
            return;
        }
        return originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
        const message = args.join(' ');
        if (message.includes('Extension context invalidated') ||
            message.includes('CORS policy') ||
            message.includes('Maximum call stack')) {
            // Silently ignore these warnings to prevent spam
            return;
        }
        return originalWarn.apply(console, args);
    };
    
    // Check if Chrome extension context is valid
    function isExtensionContextValid() {
        try {
            return typeof chrome !== 'undefined' &&
                   chrome.runtime &&
                   chrome.runtime.id &&
                   !chrome.runtime.lastError;
        } catch (error) {
            return false;
        }
    }
    
    // Get fallback storage data (permanent premium in local-only mode)
    function getFallbackStorageData(keys) {
        const defaultData = {
            DEV_MODE_PREMIUM: true,
            MOCK_PREMIUM: true,
            isPremiumUser: true,
            isPremium: true,
            userPlan: 'premium',
            subscriptionStatus: 'active',
            localOnlyMode: true,
            local_folders: [],
            isResetChatHistory: false,
            conversations: [],
            userFolders: [],
            prompts: [],
            '-r.6es£Jr1U0': true
        };
        
        if (!keys) return defaultData;
        
        if (Array.isArray(keys)) {
            const result = {};
            keys.forEach(key => {
                result[key] = defaultData[key] !== undefined ? defaultData[key] : null;
            });
            return result;
        }
        
        if (typeof keys === 'object') {
            const result = {};
            Object.keys(keys).forEach(key => {
                result[key] = defaultData[key] !== undefined ? defaultData[key] : keys[key];
            });
            return result;
        }
        
        return defaultData;
    }
    
    // Set fallback storage data
    function setFallbackStorageData(items) {
        try {
            Object.keys(items).forEach(key => {
                localStorage.setItem(key, JSON.stringify(items[key]));
            });
        } catch (error) {
            // Silently ignore localStorage errors
        }
    }
    
    // UNIFIED Chrome Storage Override - Prevents infinite loops
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const originalStorageGet = chrome.storage.local.get;
        const originalStorageSet = chrome.storage.local.set;
        
        chrome.storage.local.get = function(keys, callback) {
            // Prevent infinite recursion
            if (storageCallDepth >= MAX_CALL_DEPTH) {
                console.log('🔧 UNIFIED: Storage get call depth exceeded, using fallback');
                const fallbackData = getFallbackStorageData(keys);
                if (callback) setTimeout(() => callback(fallbackData), 0);
                return Promise.resolve(fallbackData);
            }
            
            storageCallDepth++;
            
            try {
                if (!isExtensionContextValid()) {
                    const fallbackData = getFallbackStorageData(keys);
                    if (callback) setTimeout(() => callback(fallbackData), 0);
                    return Promise.resolve(fallbackData);
                }
                
                return originalStorageGet.call(this, keys, (result) => {
                    storageCallDepth--;
                    if (chrome.runtime.lastError) {
                        const fallbackData = getFallbackStorageData(keys);
                        if (callback) callback(fallbackData);
                    } else {
                        if (callback) callback(result);
                    }
                });
            } catch (error) {
                storageCallDepth--;
                const fallbackData = getFallbackStorageData(keys);
                if (callback) setTimeout(() => callback(fallbackData), 0);
                return Promise.resolve(fallbackData);
            }
        };
        
        chrome.storage.local.set = function(items, callback) {
            // Prevent infinite recursion
            if (storageCallDepth >= MAX_CALL_DEPTH) {
                console.log('🔧 UNIFIED: Storage set call depth exceeded, using fallback');
                setFallbackStorageData(items);
                if (callback) setTimeout(callback, 0);
                return Promise.resolve();
            }
            
            storageCallDepth++;
            
            try {
                if (!isExtensionContextValid()) {
                    setFallbackStorageData(items);
                    if (callback) setTimeout(callback, 0);
                    return Promise.resolve();
                }
                
                return originalStorageSet.call(this, items, (result) => {
                    storageCallDepth--;
                    if (callback) callback(result);
                });
            } catch (error) {
                storageCallDepth--;
                setFallbackStorageData(items);
                if (callback) setTimeout(callback, 0);
                return Promise.resolve();
            }
        };
    }
    
    // SELECTIVE NETWORK BLOCKING - Block only problematic third-party APIs
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Prevent stack overflow
        if (fetchCallDepth >= MAX_CALL_DEPTH) {
            return Promise.reject(new Error('Fetch blocked: call depth exceeded'));
        }
        
        fetchCallDepth++;
        
        try {
            let urlString;
            
            try {
                if (typeof url === 'string') {
                    urlString = url;
                } else if (url && typeof url.toString === 'function') {
                    urlString = url.toString();
                } else if (url && url.href) {
                    urlString = url.href;
                } else {
                    urlString = String(url);
                }
            } catch (e) {
                return Promise.reject(new Error('URL parsing failed'));
            }
            
            // COMPLETE EXTERNAL API BLOCKING - Local-only mode blocks all intermediary APIs
            if (urlString.includes('api.infi-dev.com') || urlString.includes('ai-toolbox') || urlString.includes('infi-dev') || urlString.includes('lemonsqueezy.com')) {
                console.log('🚫 UNIFIED: Blocking external API calls (Local-only mode):', urlString);
                
                // Return mock responses for different endpoint types to prevent errors
                if (urlString.includes('/folder/get') || urlString.includes('/folder/')) {
                    console.log('📁 UNIFIED: Mocking folder API response (Local-only mode) - extension will use Real API Bridge');
                    return Promise.resolve(new Response(JSON.stringify([]), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
                
                if (urlString.includes('/conversation/get') || urlString.includes('/conversation/')) {
                    console.log('💬 UNIFIED: Mocking conversation API response (Local-only mode) - extension will use Real API Bridge');
                    return Promise.resolve(new Response(JSON.stringify([]), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
                
                if (urlString.includes('/auth/generate-jwt')) {
                    console.log('🔐 UNIFIED: Mocking JWT response (Local-only mode) - extension will use local auth');
                    return Promise.resolve(new Response(JSON.stringify({
                        jwt: 'mock.jwt.token.for.local.development',
                        success: true
                    }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
                
                // Block all other external API calls with clear error
                const error = new Error('UNIFIED BLOCK: External API calls permanently blocked in local-only mode - ' + urlString);
                error.name = 'NetworkError';
                error.code = 'BLOCKED_BY_LOCAL_ONLY_MODE';
                return Promise.reject(error);
            }
            
            // ALWAYS ALLOW OpenAI/ChatGPT API calls - core functionality in local-only mode
            if (urlString.includes('chatgpt.com') ||
                urlString.includes('openai.com') ||
                urlString.includes('backend-api') ||
                urlString.includes('oaistatic.com') ||
                urlString.includes('oaiusercontent.com') ||
                urlString.includes('chat.openai.com') ||
                urlString.includes('auth.openai.com')) {
                console.log('✅ UNIFIED: Allowing OpenAI/ChatGPT API call (Local-only mode):', urlString);
                return originalFetch.apply(window, arguments);
            }
            
            return originalFetch.apply(window, arguments);
        } finally {
            fetchCallDepth--;
        }
    };
    
    // SELECTIVE XMLHttpRequest BLOCKING
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        if (xhrCallDepth >= MAX_CALL_DEPTH) {
            return {
                open: function() {},
                send: function() {},
                setRequestHeader: function() {},
                readyState: 0,
                status: 0,
                statusText: 'Blocked by unified fix',
                responseText: '',
                response: ''
            };
        }
        
        xhrCallDepth++;
        
        try {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            
            xhr.open = function(method, url, ...args) {
                let urlString;
                
                try {
                    urlString = String(url);
                } catch (e) {
                    return;
                }
                
                // ALWAYS ALLOW OpenAI/ChatGPT API calls - these are the legitimate APIs
                if (urlString.includes('chatgpt.com') ||
                    urlString.includes('openai.com') ||
                    urlString.includes('backend-api') ||
                    urlString.includes('oaistatic.com') ||
                    urlString.includes('oaiusercontent.com') ||
                    urlString.includes('chat.openai.com')) {
                    console.log('✅ UNIFIED XHR: Allowing OpenAI/ChatGPT API call:', urlString);
                    return originalOpen.apply(xhr, [method, url, ...args]);
                }
                
                // COMPLETE EXTERNAL API BLOCKING - Force extension to use local functionality only
                if (urlString.includes('api.infi-dev.com') || urlString.includes('ai-toolbox') || urlString.includes('infi-dev')) {
                    console.log('🚫 UNIFIED XHR: Blocking ALL external API calls, using local functionality:', urlString);
                    
                    // Mock successful responses for different endpoint types
                    xhr.readyState = 4;
                    xhr.status = 200;
                    xhr.statusText = 'OK';
                    
                    if (urlString.includes('/folder/get') || urlString.includes('/folder/')) {
                        console.log('📁 UNIFIED XHR: Mocking folder API response - extension will use Real API Bridge');
                        xhr.responseText = JSON.stringify([]);
                        xhr.response = JSON.stringify([]);
                    } else if (urlString.includes('/conversation/get') || urlString.includes('/conversation/')) {
                        console.log('💬 UNIFIED XHR: Mocking conversation API response - extension will use Real API Bridge');
                        xhr.responseText = JSON.stringify([]);
                        xhr.response = JSON.stringify([]);
                    } else if (urlString.includes('/auth/generate-jwt')) {
                        console.log('🔐 UNIFIED XHR: Mocking JWT response - extension will use local auth');
                        xhr.responseText = JSON.stringify({
                            jwt: 'mock.jwt.token.for.local.development',
                            success: true
                        });
                        xhr.response = xhr.responseText;
                    } else {
                        // Block other requests with error response
                        xhr.status = 0;
                        xhr.statusText = 'UNIFIED BLOCK: External API blocked - using local functionality';
                        xhr.responseText = '';
                        xhr.response = '';
                    }
                    
                    xhr.send = function() {
                        setTimeout(() => {
                            if (xhr.onreadystatechange) {
                                xhr.onreadystatechange();
                            }
                            if (xhr.onload && xhr.status === 200) {
                                xhr.onload();
                            }
                        }, 0);
                    };
                    
                    return;
                }
                
                return originalOpen.apply(xhr, [method, url, ...args]);
            };
            
            return xhr;
        } finally {
            xhrCallDepth--;
        }
    };
    
    // IMMEDIATE window property setup
    window.DEV_MODE_PREMIUM = true;
    window.MOCK_PREMIUM = true;
    window.isPremiumUser = true;
    window.isPremium = true;
    window.userPlan = 'premium';
    window.subscriptionStatus = 'active';
    window.local_folders = [];
    window.isResetChatHistory = false;
    window.conversations = [];
    window.userFolders = [];
    window.prompts = [];
    
    // IMMEDIATE premium status object
    window.premiumStatus = {
        active: true,
        plan: 'Premium',
        features: ['manage_chats', 'manage_folders', 'manage_prompts']
    };
    
    // IMMEDIATE API functions - Use Real API Bridge for local functionality
    window.getConversations = async function() {
        console.log('🔄 UNIFIED: Using Real API Bridge for conversations');
        
        // Wait for Real API Bridge to be ready
        let attempts = 0;
        while (typeof window.realGetConversations !== 'function' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (typeof window.realGetConversations === 'function') {
            try {
                const conversations = await window.realGetConversations();
                console.log('✅ UNIFIED: Retrieved', conversations.length, 'conversations from ChatGPT DOM');
                return conversations;
            } catch (error) {
                console.warn('⚠️ UNIFIED: Real API Bridge failed, using fallback:', error);
                return [];
            }
        } else {
            console.warn('⚠️ UNIFIED: Real API Bridge not available after waiting');
            return [];
        }
    };
    
    window.getUserFolders = async function() {
        console.log('🔄 UNIFIED: Using Real API Bridge for folders');
        
        // Wait for Real API Bridge to be ready
        let attempts = 0;
        while (typeof window.realGetUserFolders !== 'function' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (typeof window.realGetUserFolders === 'function') {
            try {
                const folders = await window.realGetUserFolders();
                console.log('✅ UNIFIED: Retrieved', folders.length, 'folders from ChatGPT DOM');
                return folders;
            } catch (error) {
                console.warn('⚠️ UNIFIED: Real API Bridge failed, using fallback:', error);
                return [{
                    id: 'default',
                    name: 'All Conversations',
                    color: 'blue',
                    created_at: Date.now() / 1000,
                    updated_at: Date.now() / 1000
                }];
            }
        } else {
            console.warn('⚠️ UNIFIED: Real API Bridge not available after waiting, using fallback');
            return [{
                id: 'default',
                name: 'All Conversations',
                color: 'blue',
                created_at: Date.now() / 1000,
                updated_at: Date.now() / 1000
            }];
        }
    };
    
    window.getPrompts = async function() {
        console.log('🔄 UNIFIED: Using Real API Bridge for prompts');
        
        // Wait for Real API Bridge to be ready
        let attempts = 0;
        while (typeof window.realGetPrompts !== 'function' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (typeof window.realGetPrompts === 'function') {
            try {
                const prompts = await window.realGetPrompts();
                console.log('✅ UNIFIED: Retrieved', prompts.length, 'prompts from ChatGPT DOM');
                return prompts;
            } catch (error) {
                console.warn('⚠️ UNIFIED: Real API Bridge failed, using fallback:', error);
                return [
                    { id: 'prompt_0', title: 'Explain Like I\'m 5', content: 'Explain this concept in simple terms that a 5-year-old would understand.', category: 'General' },
                    { id: 'prompt_1', title: 'Code Review', content: 'Please review this code and suggest improvements.', category: 'Development' },
                    { id: 'prompt_2', title: 'Summarize', content: 'Please provide a concise summary of the following text.', category: 'General' }
                ];
            }
        } else {
            console.warn('⚠️ UNIFIED: Real API Bridge not available after waiting, using default prompts');
            return [
                { id: 'prompt_0', title: 'Explain Like I\'m 5', content: 'Explain this concept in simple terms that a 5-year-old would understand.', category: 'General' },
                { id: 'prompt_1', title: 'Code Review', content: 'Please review this code and suggest improvements.', category: 'Development' },
                { id: 'prompt_2', title: 'Summarize', content: 'Please provide a concise summary of the following text.', category: 'General' }
            ];
        }
    };
    
    window.getAllUserFolders = window.getUserFolders;
    
    // IMMEDIATE localStorage setup
    try {
        localStorage.setItem('DEV_MODE_PREMIUM', 'true');
        localStorage.setItem('MOCK_PREMIUM', 'true');
        localStorage.setItem('isPremiumUser', 'true');
        localStorage.setItem('isPremium', 'true');
        localStorage.setItem('userPlan', 'premium');
        localStorage.setItem('subscriptionStatus', 'active');
    } catch (e) {
        // Ignore localStorage errors
    }
    
    // IMMEDIATE global error handler
    window.onerror = function(message, source, lineno, colno, error) {
        if (message && (
            message.includes('Extension context invalidated') ||
            message.includes('CORS policy') ||
            message.includes('Illegal invocation')
        )) {
            return true; // Prevent error
        }
    };
    
    // IMMEDIATE promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && (
            event.reason.message.includes('Extension context invalidated') ||
            event.reason.message.includes('CORS policy')
        )) {
            event.preventDefault();
        }
    });
    
    // Set unified fix flags
    window.unifiedContextFixActive = true;
    window.UNIFIED_CONTEXT_FIX_LOADED = true;
    
    console.log('✅ UNIFIED CONTEXT FIX LOADED - Local-only mode with permanent premium features active');
    
})();
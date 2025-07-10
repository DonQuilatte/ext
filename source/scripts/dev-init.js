// Local-Only Mode Initialization Script
// This script configures the extension for local-only operation with all premium features enabled

(function() {
    'use strict';
    
    console.log('[LOCAL MODE] Local-only mode initialization started');
    
    // Override chrome.runtime.setUninstallURL to prevent external calls
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.setUninstallURL) {
        const originalSetUninstallURL = chrome.runtime.setUninstallURL;
        chrome.runtime.setUninstallURL = function(url) {
            console.log('[LOCAL MODE] Blocked setUninstallURL call:', url);
            return Promise.resolve();
        };
    }
    
    // Override fetch to intercept external API calls
    if (typeof fetch !== 'undefined') {
        const originalFetch = fetch;
        window.fetch = function(url, options = {}) {
            const urlString = typeof url === 'string' ? url : url.toString();
            
            // Check if this is an external API call that should be mocked
            if (window.MOCK_BACKEND && window.MOCK_BACKEND.shouldMock(urlString)) {
                console.log('[LOCAL MODE] Intercepting fetch request:', urlString);
                return window.MOCK_BACKEND.handleRequest(urlString, options);
            }
            
            // Allow local requests and ChatGPT API calls
            if (urlString.includes('chatgpt.com') || urlString.startsWith('chrome-extension://')) {
                return originalFetch.call(this, url, options);
            }
            
            // Block other external requests in local-only mode
            console.warn('[LOCAL MODE] Blocked external request in local-only mode:', urlString);
            return Promise.reject(new Error('External requests blocked in local-only mode'));
        };
    }
    
    // Override XMLHttpRequest for older API calls
    if (typeof XMLHttpRequest !== 'undefined') {
        const OriginalXHR = XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new OriginalXHR();
            const originalOpen = xhr.open;
            
            xhr.open = function(method, url, ...args) {
                const urlString = typeof url === 'string' ? url : url.toString();
                
                // Check if this should be mocked
                if (window.MOCK_BACKEND && window.MOCK_BACKEND.shouldMock(urlString)) {
                    console.log('[LOCAL MODE] Intercepting XHR request:', urlString);
                    // Convert to fetch-based mock
                    setTimeout(() => {
                        window.MOCK_BACKEND.handleRequest(urlString, { method })
                            .then(response => response.text())
                            .then(text => {
                                Object.defineProperty(xhr, 'responseText', { value: text });
                                Object.defineProperty(xhr, 'status', { value: 200 });
                                Object.defineProperty(xhr, 'readyState', { value: 4 });
                                if (xhr.onreadystatechange) xhr.onreadystatechange();
                                if (xhr.onload) xhr.onload();
                            })
                            .catch(error => {
                                if (xhr.onerror) xhr.onerror(error);
                            });
                    }, 0);
                    return;
                }
                
                // Block external requests in local-only mode
                if (!urlString.includes('chatgpt.com') && !urlString.startsWith('chrome-extension://')) {
                    console.warn('[LOCAL MODE] Blocked XHR request in local-only mode:', urlString);
                    setTimeout(() => {
                        if (xhr.onerror) xhr.onerror(new Error('External requests blocked in local-only mode'));
                    }, 0);
                    return;
                }
                
                return originalOpen.apply(this, [method, url, ...args]);
            };
            
            return xhr;
        };
    }
    
    // Set global premium flags - ALWAYS PREMIUM in local-only mode
    window.DEV_MODE_PREMIUM = true;
    
    // Premium user status - ALWAYS PREMIUM in local-only mode
    window.mockPremiumFeatures = function() {
        return {
            isPremiumUser: true,
            subscriptionStatus: "active",
            subscriptionType: "premium",
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            features: {
                unlimitedPrompts: true,
                advancedFeatures: true,
                prioritySupport: true
            }
        };
    };
    
    // Override chrome.storage.local.get to ALWAYS return premium status
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const originalGet = chrome.storage.local.get;
        chrome.storage.local.get = function(keys, callback) {
            try {
                return originalGet.call(this, keys, (result) => {
                    try {
                        // Check if extension context is still valid
                        if (chrome.runtime && chrome.runtime.id) {
                            // ALWAYS set premium user status
                            if (typeof keys === 'string' && keys.includes('store')) {
                                if (result.store) {
                                    result.store['-r.6es£Jr1U0'] = true; // Premium user flag
                                    result.store.isPremiumUser = true;
                                    result.store.subscriptionStatus = "active";
                                }
                            } else if (Array.isArray(keys) && keys.includes('store')) {
                                if (result.store) {
                                    result.store['-r.6es£Jr1U0'] = true; // Premium user flag
                                    result.store.isPremiumUser = true;
                                    result.store.subscriptionStatus = "active";
                                }
                            }
                            
                            // ALWAYS add premium status to any storage request
                            result.isPremiumUser = true;
                            result.subscriptionStatus = "active";
                            result.DEV_MODE_PREMIUM = true;
                            result.MOCK_PREMIUM = true;
                            
                            console.log('[LOCAL MODE] Always returning premium status:', result);
                            if (callback) callback(result);
                        } else {
                            console.warn('[LOCAL MODE] Extension context invalidated, using premium fallback data');
                            // ALWAYS provide premium fallback data when extension context is invalid
                            const fallbackResult = {
                                isPremiumUser: true,
                                subscriptionStatus: "active",
                                DEV_MODE_PREMIUM: true,
                                MOCK_PREMIUM: true,
                                store: {
                                    '-r.6es£Jr1U0': true,
                                    isPremiumUser: true,
                                    subscriptionStatus: "active"
                                }
                            };
                            if (callback) callback(fallbackResult);
                        }
                    } catch (error) {
                        console.error('[LOCAL MODE] Error in storage callback:', error);
                        // ALWAYS provide premium fallback data on error
                        const fallbackResult = {
                            isPremiumUser: true,
                            subscriptionStatus: "active",
                            DEV_MODE_PREMIUM: true,
                            MOCK_PREMIUM: true
                        };
                        if (callback) callback(fallbackResult);
                    }
                });
            } catch (error) {
                console.error('[LOCAL MODE] Error in storage.get override:', error);
                // ALWAYS provide premium fallback data when storage API fails
                const fallbackResult = {
                    isPremiumUser: true,
                    subscriptionStatus: "active",
                    DEV_MODE_PREMIUM: true,
                    MOCK_PREMIUM: true
                };
                if (callback) callback(fallbackResult);
                return Promise.resolve(fallbackResult);
            }
        };
    }
    
    console.log('[LOCAL MODE] Local-only mode initialization completed - All features permanently enabled');
})();
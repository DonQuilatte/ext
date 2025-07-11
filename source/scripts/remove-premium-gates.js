// Remove All Premium Feature Gates
// This script eliminates all premium/subscription constraints

console.log('🔓 REMOVE PREMIUM GATES: Starting comprehensive premium constraint removal');

(function() {
    'use strict';

    // Override all premium checking functions to always return true
    const premiumOverrides = {
        isPremiumUser: true,
        isPaid: true,
        isPremium: true,
        hasSubscription: true,
        isSubscriptionActive: true,
        canAccessPremiumFeatures: true,
        isFeatureEnabled: true,
        checkPremiumStatus: true,
        validateSubscription: true,
        hasValidSubscription: true,
        isPremiumFeatureEnabled: true
    };

    // Apply overrides to window object
    Object.keys(premiumOverrides).forEach(key => {
        // Create getter that always returns true
        Object.defineProperty(window, key, {
            get: () => true,
            set: () => {}, // Ignore attempts to set to false
            enumerable: true,
            configurable: true
        });
    });

    // Override common premium checking patterns
    window.checkPremiumAccess = () => true;
    window.requiresPremium = () => false;
    window.isPremiumRequired = () => false;
    window.showPremiumModal = () => {}; // Do nothing
    window.redirectToUpgrade = () => {}; // Do nothing
    window.showFreeUserModal = () => {}; // Do nothing
    window.showFreeMonthModal = () => {}; // Do nothing
    window.displayFreeUserGift = () => {}; // Do nothing
    window.showUpgradePrompt = () => {}; // Do nothing

    // Override storage-based premium checks
    const originalStorageGet = chrome.storage?.local?.get;
    if (originalStorageGet) {
        chrome.storage.local.get = function(keys, callback) {
            return originalStorageGet.call(this, keys, (result) => {
                if (result && typeof result === 'object') {
                    // Force premium status in storage results
                    const premiumKeys = ['isPremiumUser', 'isPaid', 'subscriptionStatus', 'planType'];
                    premiumKeys.forEach(key => {
                        if (key in result || (Array.isArray(keys) && keys.includes(key)) || keys === key) {
                            if (key === 'subscriptionStatus') {
                                result[key] = 'active';
                            } else if (key === 'planType') {
                                result[key] = 'premium';
                            } else {
                                result[key] = true;
                            }
                        }
                    });

                    // Override the encrypted storage key
                    if (result.store && typeof result.store === 'object') {
                        result.store['-r.6es£Jr1U0'] = true; // The encrypted premium key
                    }
                }
                
                if (callback) callback(result);
            });
        };
    }

    // Override localStorage premium checks
    const originalLocalStorageGetItem = localStorage.getItem;
    localStorage.getItem = function(key) {
        const result = originalLocalStorageGetItem.call(this, key);
        
        const premiumKeys = ['isPremiumUser', 'MOCK_PREMIUM', 'DEV_MODE_PREMIUM', 'subscriptionStatus', 'planType'];
        if (premiumKeys.includes(key)) {
            if (key === 'subscriptionStatus') return 'active';
            if (key === 'planType') return 'premium';
            return 'true';
        }
        
        return result;
    };

    // Override premium feature checking in common patterns
    const originalQuerySelector = Document.prototype.querySelector;
    Document.prototype.querySelector = function(selector) {
        const result = originalQuerySelector.call(this, selector);
        
        // Remove premium gates from UI elements
        if (result && selector.includes('premium')) {
            const premiumElements = ['premium-required', 'premium-modal', 'upgrade-prompt'];
            premiumElements.forEach(className => {
                if (result.classList?.contains(className)) {
                    result.style.display = 'none';
                }
            });
        }
        
        return result;
    };

    // Override fetch to intercept premium validation requests
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        const urlString = url.toString();
        
        // Intercept premium validation requests
        if (urlString.includes('premium') || urlString.includes('subscription') || urlString.includes('payment')) {
            console.log('🔓 PREMIUM GATES: Intercepted premium validation request:', urlString);
            
            // Return successful premium response
            const mockResponse = new Response(JSON.stringify({
                success: true,
                valid: true,
                isPremiumUser: true,
                isPaid: true,
                subscriptionStatus: 'active',
                planType: 'premium',
                features: ['all'],
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            }), {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            return Promise.resolve(mockResponse);
        }
        
        return originalFetch.call(this, url, options);
    };

    // Remove premium modals and upgrade prompts
    function removePremiumUI() {
        const selectors = [
            '.premium-modal',
            '.upgrade-modal',
            '.premium-required',
            '.subscription-modal',
            '.payment-modal',
            '[data-premium="true"]',
            '[data-requires-premium="true"]',
            '.premium-badge',
            '.upgrade-button',
            '.premium-lock',
            '.free-user-modal',
            '.free-month-modal',
            '[data-modal-type="free-user"]',
            '[data-modal-type="premium-upgrade"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
                element.remove();
            });
        });

        // Also remove elements containing specific text patterns
        const textPatterns = [
            'Unlock Your Free Month',
            'Unlock Your Premium Month',
            'FREEMONTH',
            'premium support',
            'Use code FREEMONTH',
            'Upgrade Now'
        ];

        textPatterns.forEach(pattern => {
            const xpath = `//div[contains(text(), '${pattern}')]`;
            const elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            
            for (let i = 0; i < elements.snapshotLength; i++) {
                const element = elements.snapshotItem(i);
                if (element) {
                    // Remove the entire modal container
                    let modal = element.closest('.modal, .popup, .overlay, [role="dialog"]');
                    if (modal) {
                        modal.style.display = 'none';
                        modal.remove();
                    } else {
                        // Remove the element itself
                        element.style.display = 'none';
                        element.remove();
                    }
                }
            }
        });
    }

    // Enable all premium features in the UI
    function enablePremiumFeatures() {
        const selectors = [
            '[data-premium-required]',
            '[data-requires-subscription]',
            '.premium-disabled',
            '.subscription-required'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.removeAttribute('data-premium-required');
                element.removeAttribute('data-requires-subscription');
                element.classList.remove('premium-disabled', 'subscription-required');
                element.classList.add('premium-enabled');
                
                // Re-enable disabled elements
                if (element.hasAttribute('disabled')) {
                    element.removeAttribute('disabled');
                }
            });
        });
    }

    // Override common premium checking functions that might be defined later
    function overrideCommonPremiumFunctions() {
        const functionsToOverride = [
            'checkIsPaidUser',
            'validatePremiumAccess',
            'requiresPremiumSubscription',
            'isPremiumFeatureAvailable',
            'canAccessFeature',
            'isFeatureUnlocked',
            'checkSubscriptionStatus',
            'validateSubscription',
            'hasActiveSubscription'
        ];

        functionsToOverride.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                window[funcName] = () => true;
            }
            
            // Also override if it gets defined later
            let originalFunc = window[funcName];
            Object.defineProperty(window, funcName, {
                get: () => () => true,
                set: (value) => {
                    if (typeof value === 'function') {
                        console.log(`🔓 PREMIUM GATES: Overrode ${funcName} to always return true`);
                        originalFunc = () => true;
                    }
                },
                enumerable: true,
                configurable: true
            });
        });
    }

    // Main execution
    function removePremiumGates() {
        console.log('🔓 PREMIUM GATES: Removing premium constraints...');
        
        // Remove premium UI elements
        removePremiumUI();
        
        // Enable premium features
        enablePremiumFeatures();
        
        // Override common premium functions
        overrideCommonPremiumFunctions();
        
        console.log('✅ PREMIUM GATES: All premium constraints removed');
    }

    // Run immediately
    removePremiumGates();

    // Run after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removePremiumGates);
    } else {
        removePremiumGates();
    }

    // Run periodically to catch dynamically added premium gates
    setInterval(removePremiumGates, 2000);

    // Monitor for new premium gates using MutationObserver
    const observer = new MutationObserver(mutations => {
        let shouldCheck = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node;
                        if (element.classList?.contains('premium-modal') ||
                            element.classList?.contains('upgrade-modal') ||
                            element.classList?.contains('free-user-modal') ||
                            element.hasAttribute('data-premium-required') ||
                            element.innerText?.includes('Unlock Your Free Month') ||
                            element.innerText?.includes('FREEMONTH') ||
                            element.innerText?.includes('premium support')) {
                            shouldCheck = true;
                            
                            // Immediately hide the element
                            element.style.display = 'none';
                            element.remove();
                        }
                    }
                });
            }
        });
        
        if (shouldCheck) {
            setTimeout(removePremiumGates, 100);
        }
    });

    // Use robust DOM utilities for safe observer setup
    function setupPremiumGateObserver() {
        try {
            if (window.domUtils && window.domUtils.isBodyReady()) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'data-premium-required', 'data-requires-subscription']
                });
                console.log('✅ PREMIUM GATES: Premium gate removal system active');
                return true;
            } else {
                console.warn('⚠️ PREMIUM GATES: document.body not ready for observer');
                return false;
            }
        } catch (error) {
            console.error('❌ PREMIUM GATES: Observer setup error:', error);
            return false;
        }
    }
    
    // Use robust DOM utilities if available, otherwise fallback to manual setup
    if (window.domUtils) {
        console.log('🔧 PREMIUM GATES: Using robust DOM utilities for observer setup');
        window.domUtils.whenBodyReady(() => {
            setupPremiumGateObserver();
        });
    } else {
        console.log('🔧 PREMIUM GATES: Robust DOM utilities not available, using fallback');
        // Fallback to original logic with enhanced error handling
        if (document.body && document.body.nodeType === Node.ELEMENT_NODE) {
            setupPremiumGateObserver();
        } else {
            // Multiple retry strategies
            const retryObserverSetup = (attempt = 1, maxAttempts = 10) => {
                if (attempt > maxAttempts) {
                    console.error('❌ PREMIUM GATES: Max retry attempts reached for observer setup');
                    return;
                }
                
                setTimeout(() => {
                    if (setupPremiumGateObserver()) {
                        console.log(`✅ PREMIUM GATES: Observer setup successful on attempt ${attempt}`);
                    } else {
                        console.log(`🔄 PREMIUM GATES: Observer retry attempt ${attempt}/${maxAttempts}`);
                        retryObserverSetup(attempt + 1, maxAttempts);
                    }
                }, attempt * 100); // Exponential backoff
            };
            
            // Start retry process
            retryObserverSetup();
            
            // Also try on DOMContentLoaded if still loading
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    if (!setupPremiumGateObserver()) {
                        retryObserverSetup();
                    }
                });
            }
        }
    }
})();

console.log('🔓 PREMIUM GATES: All premium constraints have been removed - Extension is now completely free!');
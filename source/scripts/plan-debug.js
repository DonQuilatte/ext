// Plan Debug Script
// This script provides comprehensive debugging for plan display issues

(function() {
    'use strict';
    
    console.log('🔍 Plan Debug Script loaded');
    
    // Debug configuration
    const DEBUG_CONFIG = {
        logLevel: 'verbose', // 'minimal', 'normal', 'verbose'
        monitorInterval: 3000, // ms
        searchDepth: 10 // DOM traversal depth
    };
    
    // Storage keys to monitor
    const STORAGE_KEYS_TO_MONITOR = [
        'DEV_MODE_PREMIUM',
        'MOCK_PREMIUM',
        'isPremiumUser',
        'userPlan',
        'subscriptionStatus',
        'planType',
        '-r.6es£Jr1U0', // The key we discovered
        'premium',
        'subscription',
        'plan'
    ];
    
    // Text patterns to search for
    const PLAN_TEXT_PATTERNS = [
        /toolbox.*plan.*free/i,
        /free.*plan/i,
        /premium.*plan/i,
        /subscription.*free/i,
        /subscription.*premium/i,
        /plan.*status/i
    ];
    
    // Function to get all storage data
    async function getAllStorageData() {
        return new Promise((resolve) => {
            try {
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.runtime && !chrome.runtime.lastError) {
                    // Try local storage first
                    chrome.storage.local.get(null, (data) => {
                        if (chrome.runtime.lastError) {
                            console.log('[Plan Debug] Chrome storage local error, using fallback');
                            resolve(getFallbackStorageData());
                            return;
                        }
                        
                        // Try sync storage with error handling
                        try {
                            chrome.storage.sync.get(null, (syncData) => {
                                if (chrome.runtime.lastError) {
                                    console.log('[Plan Debug] Chrome storage sync error, using local only');
                                    resolve({
                                        local: data || {},
                                        sync: {}
                                    });
                                } else {
                                    resolve({
                                        local: data || {},
                                        sync: syncData || {}
                                    });
                                }
                            });
                        } catch (syncError) {
                            console.log('[Plan Debug] Sync storage access failed, using local only');
                            resolve({
                                local: data || {},
                                sync: {}
                            });
                        }
                    });
                } else {
                    resolve(getFallbackStorageData());
                }
            } catch (error) {
                console.log('[Plan Debug] Storage access failed, using fallback:', error.message);
                resolve(getFallbackStorageData());
            }
        });
    }
    
    // Fallback storage data function
    function getFallbackStorageData() {
        try {
            // Fallback to localStorage
            const localData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                localData[key] = localStorage.getItem(key);
            }
            return {
                local: localData,
                sync: {}
            };
        } catch (error) {
            console.log('[Plan Debug] localStorage fallback failed:', error.message);
            return {
                local: {},
                sync: {}
            };
        }
    }
    
    // Function to find elements containing plan text
    function findPlanElements() {
        const results = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            if (text) {
                for (const pattern of PLAN_TEXT_PATTERNS) {
                    if (pattern.test(text)) {
                        results.push({
                            node: node,
                            text: text,
                            parent: node.parentElement,
                            pattern: pattern.toString()
                        });
                    }
                }
            }
        }
        
        return results;
    }
    
    // Function to analyze DOM structure around plan elements
    function analyzePlanElements(elements) {
        return elements.map(item => {
            const analysis = {
                text: item.text,
                pattern: item.pattern,
                element: {
                    tagName: item.parent?.tagName,
                    className: item.parent?.className,
                    id: item.parent?.id,
                    attributes: {}
                },
                ancestors: []
            };
            
            // Get all attributes
            if (item.parent?.attributes) {
                for (const attr of item.parent.attributes) {
                    analysis.element.attributes[attr.name] = attr.value;
                }
            }
            
            // Get ancestor chain
            let ancestor = item.parent;
            let depth = 0;
            while (ancestor && depth < DEBUG_CONFIG.searchDepth) {
                analysis.ancestors.push({
                    tagName: ancestor.tagName,
                    className: ancestor.className,
                    id: ancestor.id,
                    depth: depth
                });
                ancestor = ancestor.parentElement;
                depth++;
            }
            
            return analysis;
        });
    }
    
    // Function to check for plan-related JavaScript variables
    function checkGlobalVariables() {
        const planVars = {};
        const globalKeys = Object.keys(window);
        
        globalKeys.forEach(key => {
            if (/plan|premium|subscription|free/i.test(key)) {
                try {
                    planVars[key] = window[key];
                } catch (e) {
                    planVars[key] = '[Error accessing]';
                }
            }
        });
        
        return planVars;
    }
    
    // Function to monitor network requests
    function setupNetworkMonitoring() {
        const originalFetch = window.fetch;
        const originalXHR = window.XMLHttpRequest;
        
        // Monitor fetch requests
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && /plan|premium|subscription|auth/i.test(url)) {
                console.log('🌐 Plan-related fetch request:', url);
            }
            return originalFetch.apply(this, args);
        };
        
        // Monitor XHR requests
        const originalOpen = originalXHR.prototype.open;
        originalXHR.prototype.open = function(method, url, ...args) {
            if (typeof url === 'string' && /plan|premium|subscription|auth/i.test(url)) {
                console.log('🌐 Plan-related XHR request:', method, url);
            }
            return originalOpen.apply(this, [method, url, ...args]);
        };
    }
    
    // Main debug function
    async function runPlanDebug() {
        console.log('🔍 === PLAN DEBUG REPORT ===');
        
        // 1. Storage Analysis
        console.log('📦 Storage Analysis:');
        const storageData = await getAllStorageData();
        
        console.log('Local Storage:');
        STORAGE_KEYS_TO_MONITOR.forEach(key => {
            if (storageData.local.hasOwnProperty(key)) {
                console.log(`  ✅ ${key}:`, storageData.local[key]);
            } else {
                console.log(`  ❌ ${key}: NOT FOUND`);
            }
        });
        
        console.log('Sync Storage:');
        STORAGE_KEYS_TO_MONITOR.forEach(key => {
            if (storageData.sync.hasOwnProperty(key)) {
                console.log(`  ✅ ${key}:`, storageData.sync[key]);
            }
        });
        
        // 2. DOM Analysis
        console.log('🏗️ DOM Analysis:');
        const planElements = findPlanElements();
        console.log(`Found ${planElements.length} elements with plan text`);
        
        if (planElements.length > 0) {
            const analysis = analyzePlanElements(planElements);
            analysis.forEach((item, index) => {
                console.log(`Element ${index + 1}:`);
                console.log('  Text:', item.text);
                console.log('  Pattern:', item.pattern);
                console.log('  Element:', item.element);
                console.log('  Ancestors:', item.ancestors.slice(0, 3)); // Show first 3 ancestors
            });
        }
        
        // 3. Global Variables
        console.log('🌍 Global Variables:');
        const globalVars = checkGlobalVariables();
        Object.keys(globalVars).forEach(key => {
            console.log(`  ${key}:`, globalVars[key]);
        });
        
        // 4. Extension Context
        console.log('🔧 Extension Context:');
        console.log('  Chrome extension context:', typeof chrome !== 'undefined');
        console.log('  Storage API available:', typeof chrome?.storage !== 'undefined');
        console.log('  Current URL:', window.location.href);
        console.log('  Document ready state:', document.readyState);
        
        console.log('🔍 === END DEBUG REPORT ===');
    }
    
    // Setup monitoring
    setupNetworkMonitoring();
    
    // Run initial debug
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runPlanDebug);
    } else {
        setTimeout(runPlanDebug, 1000); // Give other scripts time to load
    }
    
    // Periodic monitoring
    setInterval(runPlanDebug, DEBUG_CONFIG.monitorInterval);
    
    // Expose global debug functions
    window.planDebug = {
        run: runPlanDebug,
        findElements: findPlanElements,
        getStorage: getAllStorageData,
        checkVars: checkGlobalVariables,
        config: DEBUG_CONFIG
    };
    
    console.log('✅ Plan Debug Script initialized - use window.planDebug.run() to trigger manual debug');
    
})();
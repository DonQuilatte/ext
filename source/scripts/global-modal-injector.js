// Global Modal Function Injector
// This script ensures the modal functions are available in the global window context
// It runs early and waits for the modal functions to be defined before exposing them

(function() {
    'use strict';
    
    console.log('🚀 Global Modal Function Injector: Starting injection process...');
    
    // Function names to inject
    const modalFunctions = [
        'showManageChatsModal',
        'showManageFoldersModal', 
        'showManagePromptsModal',
        'showMediaGalleryModal',
        'showTestMenuModal'
    ];
    
    // Track which functions have been injected
    const injectedFunctions = new Set();
    
    // Function to check if a function exists and inject it
    function checkAndInjectFunction(funcName) {
        // Check if function exists in window context
        if (typeof window[funcName] === 'function' && !injectedFunctions.has(funcName)) {
            console.log(`✅ ${funcName} already available in global context`);
            injectedFunctions.add(funcName);
            return true;
        }
        
        // If not available, try to find it in other contexts
        if (typeof window[funcName] !== 'function') {
            // Create a placeholder function that will be replaced when the real function loads
            if (!window[funcName]) {
                window[funcName] = function() {
                    console.warn(`⚠️ ${funcName} called but not yet loaded. Attempting to load...`);
                    
                    // Try to load the function again
                    setTimeout(() => {
                        if (typeof window[funcName] === 'function') {
                            console.log(`🔄 ${funcName} now available, calling it...`);
                            window[funcName]();
                        } else {
                            console.error(`❌ ${funcName} still not available after retry`);
                            alert(`${funcName.replace('show', '').replace('Modal', '')} feature is still loading. Please try again in a moment.`);
                        }
                    }, 100);
                };
                console.log(`🔄 Created placeholder for ${funcName}`);
            }
        }
        
        return false;
    }
    
    // Function to inject all modal functions
    function injectModalFunctions() {
        modalFunctions.forEach(funcName => {
            checkAndInjectFunction(funcName);
        });
    }
    
    // Immediate injection attempt
    injectModalFunctions();
    
    // Set up a MutationObserver to watch for script additions
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Check if any new scripts were added
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        // A new script was added, retry injection
                        setTimeout(injectModalFunctions, 50);
                    }
                });
            }
        });
    });
    
    // Start observing
    if (document.head) {
        observer.observe(document.head, { childList: true, subtree: true });
    }
    
    // Retry injection at intervals
    const retryInterval = setInterval(() => {
        injectModalFunctions();
        
        // Check if all functions have been injected
        if (injectedFunctions.size === modalFunctions.length) {
            console.log('🎯 All modal functions successfully injected!');
            clearInterval(retryInterval);
            observer.disconnect();
        }
    }, 500);
    
    // Stop retrying after 10 seconds
    setTimeout(() => {
        clearInterval(retryInterval);
        observer.disconnect();
        
        const missing = modalFunctions.filter(func => !injectedFunctions.has(func));
        if (missing.length > 0) {
            console.warn('⚠️ Some modal functions were not injected:', missing);
        }
    }, 10000);
    
    // Expose injection status for debugging
    window.modalInjectionStatus = {
        injectedFunctions: injectedFunctions,
        totalFunctions: modalFunctions.length,
        isComplete: () => injectedFunctions.size === modalFunctions.length
    };
    
    console.log('🔧 Global Modal Function Injector: Setup complete');
    
})();
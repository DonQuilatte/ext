// Debug Console Script
// This script provides debugging functions directly in the browser console

(function() {
    'use strict';
    
    console.log('[DEBUG] Debug console script loaded');
    
    // Simple function to check what's available
    window.debugExtension = function() {
        console.log('=== EXTENSION DEBUG INFO ===');
        console.log('DEV_MODE_CONFIG:', typeof window.DEV_MODE_CONFIG !== 'undefined' ? window.DEV_MODE_CONFIG : 'NOT FOUND');
        console.log('MOCK_BACKEND:', typeof window.MOCK_BACKEND !== 'undefined' ? window.MOCK_BACKEND : 'NOT FOUND');
        console.log('mockBackend:', typeof window.mockBackend !== 'undefined' ? window.mockBackend : 'NOT FOUND');
        console.log('verifyOfflineMode:', typeof window.verifyOfflineMode !== 'undefined' ? 'AVAILABLE' : 'NOT FOUND');
        console.log('mockPremiumFeatures:', typeof window.mockPremiumFeatures !== 'undefined' ? 'AVAILABLE' : 'NOT FOUND');
        
        // Check if scripts are loaded
        const scripts = document.querySelectorAll('script');
        const extensionScripts = Array.from(scripts).filter(script => 
            script.src && (
                script.src.includes('dev-mode.js') || 
                script.src.includes('mock-backend.js') || 
                script.src.includes('dev-init.js') || 
                script.src.includes('verify-offline.js')
            )
        );
        
        console.log('Extension scripts found:', extensionScripts.length);
        extensionScripts.forEach(script => console.log('- Script:', script.src));
        
        return {
            devModeConfig: typeof window.DEV_MODE_CONFIG !== 'undefined',
            mockBackend: typeof window.MOCK_BACKEND !== 'undefined' || typeof window.mockBackend !== 'undefined',
            verifyFunction: typeof window.verifyOfflineMode !== 'undefined',
            scriptsLoaded: extensionScripts.length
        };
    };
    
    // Manual verification function
    window.manualVerify = function() {
        console.log('[MANUAL VERIFY] Starting manual verification...');
        
        // Test 1: Check premium features
        if (typeof window.mockPremiumFeatures === 'function') {
            const premiumData = window.mockPremiumFeatures();
            console.log('[MANUAL VERIFY] ✓ Premium features mocked:', premiumData);
        } else {
            console.log('[MANUAL VERIFY] ❌ Premium features not mocked');
        }
        
        // Test 2: Check fetch override
        if (window.fetch && window.fetch.toString().includes('DEV_MODE')) {
            console.log('[MANUAL VERIFY] ✓ Fetch is overridden for development mode');
        } else {
            console.log('[MANUAL VERIFY] ❌ Fetch may not be properly overridden');
        }
        
        // Test 3: Test external API call
        console.log('[MANUAL VERIFY] Testing external API call...');
        fetch('https://api.infi-dev.com/ai-toolbox/auth/generate-jwt')
            .then(response => response.text())
            .then(text => {
                if (text.includes('mock') || text.includes('jwt')) {
                    console.log('[MANUAL VERIFY] ✓ External API call mocked successfully');
                } else {
                    console.log('[MANUAL VERIFY] ❌ External API call may not be mocked');
                }
            })
            .catch(error => {
                if (error.message.includes('blocked')) {
                    console.log('[MANUAL VERIFY] ✓ External API call properly blocked');
                } else {
                    console.log('[MANUAL VERIFY] ❌ Unexpected error:', error);
                }
            });
        
        return 'Manual verification started - check console for results';
    };
    
    // Simple test function
    window.testOfflineMode = function() {
        console.log('🧪 TESTING OFFLINE MODE');
        console.log('========================');
        
        const tests = {
            configLoaded: typeof window.DEV_MODE_CONFIG !== 'undefined',
            mockBackendLoaded: typeof window.mockBackend !== 'undefined',
            premiumMocked: typeof window.mockPremiumFeatures === 'function' || window.DEV_MODE_PREMIUM === true,
            fetchOverridden: window.fetch && window.fetch.toString().includes('originalFetch')
        };
        
        for (const [test, result] of Object.entries(tests)) {
            console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASS' : 'FAIL'}`);
        }
        
        const passedTests = Object.values(tests).filter(Boolean).length;
        console.log(`\nResult: ${passedTests}/${Object.keys(tests).length} tests passed`);
        
        if (passedTests === Object.keys(tests).length) {
            console.log('🎉 Offline mode is working correctly!');
        } else {
            console.log('⚠️ Some issues detected with offline mode setup');
        }
        
        return tests;
    };
    
    console.log('[DEBUG] Available functions: debugExtension(), manualVerify(), testOfflineMode()');
    
})();
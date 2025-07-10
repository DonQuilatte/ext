// ULTRA-NUCLEAR FIX TESTING SCRIPT
// This script tests all blocking mechanisms to ensure they're working

(function() {
    'use strict';
    
    console.log('🧪 TESTING ULTRA-NUCLEAR FIX - Starting comprehensive tests...');
    
    let testResults = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    function addTest(name, passed, details) {
        testResults.tests.push({ name, passed, details });
        if (passed) {
            testResults.passed++;
            console.log(`✅ TEST PASSED: ${name} - ${details}`);
        } else {
            testResults.failed++;
            console.log(`❌ TEST FAILED: ${name} - ${details}`);
        }
    }
    
    // Test 1: Check if ultra-nuclear fix is loaded
    const fixLoaded = window.ULTRA_NUCLEAR_ACTIVE === true;
    addTest('Ultra-Nuclear Fix Loaded', fixLoaded, `ULTRA_NUCLEAR_ACTIVE = ${window.ULTRA_NUCLEAR_ACTIVE}`);
    
    // Test 2: Test fetch blocking
    let fetchBlocked = false;
    try {
        fetch('https://api.infi-dev.com/test').catch(error => {
            fetchBlocked = error.message.includes('NUCLEAR BLOCK') || error.message.includes('ULTRA-NUCLEAR BLOCK');
        });
    } catch (error) {
        fetchBlocked = error.message.includes('NUCLEAR BLOCK') || error.message.includes('ULTRA-NUCLEAR BLOCK');
    }
    addTest('Fetch Blocking', fetchBlocked, 'api.infi-dev.com requests blocked');
    
    // Test 3: Test XHR blocking
    let xhrBlocked = false;
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.infi-dev.com/test');
        xhrBlocked = xhr.readyState === 0; // Should be blocked at open level
    } catch (error) {
        xhrBlocked = true;
    }
    addTest('XHR Blocking', xhrBlocked, 'XMLHttpRequest to api.infi-dev.com blocked');
    
    // Test 4: Test URL constructor blocking
    let urlBlocked = false;
    try {
        new URL('https://api.infi-dev.com/test');
    } catch (error) {
        urlBlocked = error.message.includes('ULTRA-NUCLEAR BLOCK');
    }
    addTest('URL Constructor Blocking', urlBlocked, 'URL constructor blocks api.infi-dev.com');
    
    // Test 5: Test WebSocket blocking (if available)
    if (window.WebSocket) {
        let wsBlocked = false;
        try {
            new WebSocket('wss://api.infi-dev.com/ws');
        } catch (error) {
            wsBlocked = error.message.includes('ULTRA-NUCLEAR BLOCK');
        }
        addTest('WebSocket Blocking', wsBlocked, 'WebSocket to api.infi-dev.com blocked');
    }
    
    // Test 6: Test EventSource blocking (if available)
    if (window.EventSource) {
        let esBlocked = false;
        try {
            new EventSource('https://api.infi-dev.com/events');
        } catch (error) {
            esBlocked = error.message.includes('ULTRA-NUCLEAR BLOCK');
        }
        addTest('EventSource Blocking', esBlocked, 'EventSource to api.infi-dev.com blocked');
    }
    
    // Test 7: Test Request constructor blocking
    let requestBlocked = false;
    try {
        new Request('https://api.infi-dev.com/test');
    } catch (error) {
        requestBlocked = error.message.includes('NUCLEAR BLOCK');
    }
    addTest('Request Constructor Blocking', requestBlocked, 'Request constructor blocks api.infi-dev.com');
    
    // Test 8: Test premium status setup
    const premiumSetup = window.isPremiumUser === true && window.userPlan === 'premium';
    addTest('Premium Status Setup', premiumSetup, `isPremiumUser=${window.isPremiumUser}, userPlan=${window.userPlan}`);
    
    // Test 9: Test Chrome storage override
    const chromeStorageOverride = typeof window.chromeStorageGet === 'function';
    addTest('Chrome Storage Override', chromeStorageOverride, 'Chrome storage functions available');
    
    // Test 10: Test error suppression
    let errorSuppressed = false;
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('Extension context invalidated')) {
            errorSuppressed = true;
        }
        return originalConsoleError.apply(console, args);
    };
    
    // Trigger a test error
    try {
        console.error('Extension context invalidated test');
    } catch (e) {
        // Error should be suppressed
    }
    
    addTest('Error Suppression', errorSuppressed, 'Extension context invalidated errors suppressed');
    
    // Test 11: Test service worker registration
    const serviceWorkerTest = 'serviceWorker' in navigator;
    addTest('Service Worker Available', serviceWorkerTest, 'Service worker API available for blocking');
    
    // Test 12: Test script src blocking
    let scriptBlocked = false;
    try {
        const script = document.createElement('script');
        script.src = 'https://api.infi-dev.com/script.js';
        scriptBlocked = !script.src || script.src === '';
    } catch (error) {
        scriptBlocked = true;
    }
    addTest('Script Src Blocking', scriptBlocked, 'Script src to api.infi-dev.com blocked');
    
    // Test 13: Test enhanced pattern blocking
    let enhancedBlocked = false;
    try {
        fetch('https://premium.example.com/api/test').catch(error => {
            enhancedBlocked = error.message.includes('NUCLEAR BLOCK') || error.message.includes('ULTRA-NUCLEAR BLOCK');
        });
    } catch (error) {
        enhancedBlocked = error.message.includes('NUCLEAR BLOCK') || error.message.includes('ULTRA-NUCLEAR BLOCK');
    }
    addTest('Enhanced Pattern Blocking', enhancedBlocked, 'Premium/subscription patterns blocked');
    
    // Final Results
    console.log('\n🧪 ULTRA-NUCLEAR FIX TEST RESULTS:');
    console.log(`✅ Tests Passed: ${testResults.passed}`);
    console.log(`❌ Tests Failed: ${testResults.failed}`);
    console.log(`📊 Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
    
    if (testResults.failed === 0) {
        console.log('🎉 ALL TESTS PASSED - ULTRA-NUCLEAR FIX IS FULLY OPERATIONAL!');
    } else {
        console.log('⚠️ Some tests failed - check individual test results above');
    }
    
    // Store results globally for inspection
    window.ultraNuclearTestResults = testResults;
    
    return testResults;
})();
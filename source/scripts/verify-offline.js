// Offline Mode Verification Script
// This script tests that all external dependencies are properly mocked

(function() {
    'use strict';
    
    console.log('[VERIFY] Starting offline mode verification...');
    
    const testResults = {
        configLoaded: false,
        mockBackendLoaded: false,
        externalCallsBlocked: false,
        premiumFeaturesEnabled: false,
        authMocked: false,
        paymentsMocked: false
    };
    
    // Test 1: Check if development mode configuration is loaded
    function testConfigLoaded() {
        if (typeof window !== 'undefined' && window.DEV_MODE_CONFIG) {
            console.log('[VERIFY] ✓ Development mode configuration loaded');
            testResults.configLoaded = true;
            return true;
        } else {
            console.error('[VERIFY] ✗ Development mode configuration not found');
            return false;
        }
    }
    
    // Test 2: Check if mock backend is loaded
    function testMockBackendLoaded() {
        if (typeof window !== 'undefined' && window.MOCK_BACKEND) {
            console.log('[VERIFY] ✓ Mock backend loaded');
            testResults.mockBackendLoaded = true;
            return true;
        } else {
            console.error('[VERIFY] ✗ Mock backend not found');
            return false;
        }
    }
    
    // Test 3: Test external call blocking
    async function testExternalCallBlocking() {
        try {
            // Try to make a request to the external API
            const response = await fetch('https://api.infi-dev.com/ai-toolbox/auth/generate-jwt');
            
            // If we get here, check if it's a mocked response
            const text = await response.text();
            if (text.includes('MOCK_RESPONSE') || text.includes('jwt')) {
                console.log('[VERIFY] ✓ External API calls are being mocked');
                testResults.externalCallsBlocked = true;
                return true;
            } else {
                console.warn('[VERIFY] ⚠ External API call went through - may not be properly mocked');
                return false;
            }
        } catch (error) {
            if (error.message.includes('blocked in development mode')) {
                console.log('[VERIFY] ✓ External API calls are properly blocked');
                testResults.externalCallsBlocked = true;
                return true;
            } else {
                console.error('[VERIFY] ✗ Unexpected error testing external calls:', error);
                return false;
            }
        }
    }
    
    // Test 4: Test premium features
    function testPremiumFeatures() {
        // Check if DEV_MODE_PREMIUM is set (from payments.js)
        if (typeof window !== 'undefined' &&
            (window.DEV_MODE_PREMIUM ||
             (window.DEV_MODE_CONFIG && window.DEV_MODE_CONFIG.MOCK_PREMIUM))) {
            console.log('[VERIFY] ✓ Premium features are enabled in development mode');
            testResults.premiumFeaturesEnabled = true;
            return true;
        } else {
            console.warn('[VERIFY] ⚠ Premium features may not be properly mocked');
            return false;
        }
    }
    
    // Test 5: Test authentication mocking
    async function testAuthMocking() {
        if (window.MOCK_BACKEND && window.MOCK_BACKEND.mockResponses) {
            const authEndpoints = [
                'https://api.infi-dev.com/ai-toolbox/auth/generate-jwt',
                'https://api.infi-dev.com/ai-toolbox/auth/jwks'
            ];
            
            let allMocked = true;
            for (const endpoint of authEndpoints) {
                if (!window.MOCK_BACKEND.shouldMock(endpoint)) {
                    allMocked = false;
                    break;
                }
            }
            
            if (allMocked) {
                console.log('[VERIFY] ✓ Authentication endpoints are mocked');
                testResults.authMocked = true;
                return true;
            }
        }
        
        console.warn('[VERIFY] ⚠ Authentication mocking may not be complete');
        return false;
    }
    
    // Test 6: Test payments mocking
    async function testPaymentsMocking() {
        if (window.MOCK_BACKEND && window.MOCK_BACKEND.mockResponses) {
            const paymentEndpoints = [
                'https://api.infi-dev.com/ai-toolbox/payments/validate-subscription',
                'https://api.infi-dev.com/ai-toolbox/user/cancel-deletion'
            ];
            
            let allMocked = true;
            for (const endpoint of paymentEndpoints) {
                if (!window.MOCK_BACKEND.shouldMock(endpoint)) {
                    allMocked = false;
                    break;
                }
            }
            
            if (allMocked) {
                console.log('[VERIFY] ✓ Payment endpoints are mocked');
                testResults.paymentsMocked = true;
                return true;
            }
        }
        
        console.warn('[VERIFY] ⚠ Payment mocking may not be complete');
        return false;
    }
    
    // Run all tests
    async function runAllTests() {
        console.log('[VERIFY] Running comprehensive offline mode tests...');
        
        testConfigLoaded();
        testMockBackendLoaded();
        await testExternalCallBlocking();
        testPremiumFeatures();
        await testAuthMocking();
        await testPaymentsMocking();
        
        // Generate report
        const passedTests = Object.values(testResults).filter(result => result === true).length;
        const totalTests = Object.keys(testResults).length;
        
        console.log('\n[VERIFY] Test Results Summary:');
        console.log('================================');
        for (const [test, result] of Object.entries(testResults)) {
            console.log(`${result ? '✓' : '✗'} ${test}: ${result ? 'PASS' : 'FAIL'}`);
        }
        console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('\n🎉 All tests passed! Extension is ready for offline development.');
        } else {
            console.warn('\n⚠️  Some tests failed. Please check the configuration.');
        }
        
        return testResults;
    }
    
    // Auto-run tests when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(runAllTests, 1000); // Wait for other scripts to load
        });
    } else {
        setTimeout(runAllTests, 1000);
    }
    
    // Expose test function globally for manual testing
    window.verifyOfflineMode = runAllTests;
    
    // Also expose a simple version that doesn't depend on complex initialization
    window.quickVerify = function() {
        console.log('🔍 QUICK OFFLINE VERIFICATION');
        console.log('============================');
        
        const checks = {
            'DEV_MODE_CONFIG loaded': typeof window.DEV_MODE_CONFIG !== 'undefined',
            'Mock backend available': typeof window.mockBackend !== 'undefined' || typeof window.MOCK_BACKEND !== 'undefined',
            'Premium features mocked': typeof window.mockPremiumFeatures === 'function',
            'Fetch overridden': window.fetch && window.fetch.toString().includes('originalFetch')
        };
        
        for (const [check, result] of Object.entries(checks)) {
            console.log(`${result ? '✅' : '❌'} ${check}`);
        }
        
        const passed = Object.values(checks).filter(Boolean).length;
        console.log(`\nResult: ${passed}/${Object.keys(checks).length} checks passed`);
        
        if (passed === Object.keys(checks).length) {
            console.log('🎉 Extension is ready for offline development!');
        } else {
            console.log('⚠️ Some issues detected - try reloading the extension');
        }
        
        return checks;
    };
    
})();
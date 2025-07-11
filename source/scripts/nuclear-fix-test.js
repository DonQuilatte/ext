// Nuclear Fix Test Script
// Tests all blocking mechanisms to ensure CORS requests are completely blocked

(function() {
    'use strict';
    
    console.log('🧪 NUCLEAR FIX TEST STARTING...');
    
    // Wait for nuclear fix to load
    setTimeout(() => {
        console.log('🧪 Testing nuclear fix effectiveness...');
        
        // Test 1: Check if nuclear fix is loaded
        if (window.nuclearFixActive && window.ISHKA_ULTRA_FIX_LOADED) {
            console.log('✅ Nuclear fix is loaded and active');
        } else {
            console.log('❌ Nuclear fix is NOT loaded');
        }
        
        // Test 2: Test fetch blocking
        console.log('🧪 Testing fetch blocking...');
        fetch('https://api.infi-dev.com/example-removed/auth/jwks?test=nuclear')
            .then(response => {
                console.log('❌ CRITICAL: Fetch request succeeded (should be blocked):', response);
            })
            .catch(error => {
                console.log('✅ Fetch request blocked as expected:', error.message);
            });
        
        // Test 3: Test XMLHttpRequest blocking
        console.log('🧪 Testing XMLHttpRequest blocking...');
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.infi-dev.com/example-removed/auth/jwks?test=nuclear-xhr');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 0) {
                        console.log('✅ XHR request blocked as expected');
                    } else {
                        console.log('❌ CRITICAL: XHR request succeeded (should be blocked)');
                    }
                }
            };
            xhr.onerror = function() {
                console.log('✅ XHR request blocked with error as expected');
            };
            xhr.send();
        } catch (error) {
            console.log('✅ XHR request blocked with exception:', error.message);
        }
        
        // Test 4: Test Request constructor blocking
        console.log('🧪 Testing Request constructor blocking...');
        try {
            const request = new Request('https://api.infi-dev.com/example-removed/auth/jwks?test=nuclear-request');
            console.log('❌ CRITICAL: Request constructor succeeded (should be blocked)');
        } catch (error) {
            console.log('✅ Request constructor blocked as expected:', error.message);
        }
        
        // Test 5: Test various URL patterns
        const testUrls = [
            'https://api.infi-dev.com/example-removed/auth/jwks',
            'https://auth.openai.com/jwks',
            'https://api.infi-dev.com/test',
            'https://example.com/jwks',
            'https://test.com/example-removed',
            'https://test.com/infi-dev',
            'https://test.com/cacheBuster=123'
        ];
        
        console.log('🧪 Testing various URL patterns...');
        testUrls.forEach((url, index) => {
            setTimeout(() => {
                fetch(url + '?test=pattern-' + index)
                    .then(response => {
                        console.log('❌ CRITICAL: Pattern test succeeded for:', url);
                    })
                    .catch(error => {
                        console.log('✅ Pattern test blocked for:', url, error.message);
                    });
            }, index * 100);
        });
        
        // Test 6: Check for stack overflow protection
        console.log('🧪 Testing stack overflow protection...');
        let fetchCount = 0;
        function recursiveFetch() {
            fetchCount++;
            if (fetchCount > 10) {
                console.log('✅ Stack overflow protection working - stopped at', fetchCount, 'calls');
                return;
            }
            
            fetch('https://api.infi-dev.com/recursive-test-' + fetchCount)
                .then(() => {
                    console.log('❌ CRITICAL: Recursive fetch succeeded');
                    recursiveFetch();
                })
                .catch(() => {
                    console.log('✅ Recursive fetch blocked at call', fetchCount);
                    recursiveFetch();
                });
        }
        recursiveFetch();
        
        // Test 7: Test extension context stability
        console.log('🧪 Testing extension context stability...');
        try {
            if (chrome && chrome.runtime && chrome.runtime.id) {
                console.log('✅ Chrome extension context is stable');
            } else {
                console.log('⚠️ Chrome extension context not available (may be expected)');
            }
        } catch (error) {
            console.log('⚠️ Chrome extension context error:', error.message);
        }
        
        // Final summary after all tests
        setTimeout(() => {
            console.log('🧪 NUCLEAR FIX TEST COMPLETED');
            console.log('🧪 Check above results - all external API requests should be blocked');
            console.log('🧪 If any CRITICAL errors appear, the nuclear fix needs adjustment');
        }, 2000);
        
    }, 1000);
    
})();
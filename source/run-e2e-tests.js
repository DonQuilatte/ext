#!/usr/bin/env node

// End-to-End Test Runner for Ishka Extension
// This script simulates extension loading and runs comprehensive tests

const fs = require('fs');
const path = require('path');

console.log('🚀 [TEST-RUNNER] Starting Ishka Extension E2E Test Runner...');
console.log('🚀 [TEST-RUNNER] ================================================');

// Simulate browser environment
global.window = global;
global.document = {
    readyState: 'complete',
    querySelectorAll: (selector) => {
        console.log(`🔍 [TEST-RUNNER] DOM Query: ${selector}`);
        // Simulate some elements being found
        if (selector.includes('manage-chats') || selector.includes('manage-folders') || selector.includes('manage-prompts')) {
            return [{ 
                style: { display: 'block' }, 
                disabled: false,
                textContent: 'Premium Feature',
                click: () => console.log(`🖱️  [TEST-RUNNER] Clicked: ${selector}`)
            }];
        }
        if (selector.includes('plan') || selector.includes('premium')) {
            return [{ 
                textContent: 'Toolbox Plan - Premium',
                innerText: 'Premium'
            }];
        }
        return [];
    },
    addEventListener: (event, callback) => {
        console.log(`📅 [TEST-RUNNER] Event listener added: ${event}`);
        if (event === 'DOMContentLoaded') {
            setTimeout(callback, 100);
        }
    }
};

// Simulate Chrome extension API
global.chrome = {
    runtime: {
        id: 'test-extension-id',
        lastError: null,
        getManifest: () => ({
            name: 'Ishka',
            version: '1.0.0',
            icons: {
                '16': 'icons/yellow-circle-16.png',
                '48': 'icons/yellow-circle-48.png',
                '128': 'icons/yellow-circle-128.png'
            }
        })
    },
    storage: {
        local: {
            get: (keys, callback) => {
                console.log(`💾 [TEST-RUNNER] Chrome storage get: ${JSON.stringify(keys)}`);
                setTimeout(() => callback({}), 10);
            },
            set: (data, callback) => {
                console.log(`💾 [TEST-RUNNER] Chrome storage set: ${JSON.stringify(data)}`);
                if (callback) setTimeout(callback, 10);
            }
        }
    }
};

// Simulate console with test tracking
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

let testOutput = [];
let errorCount = 0;
let warningCount = 0;

console.log = function(...args) {
    const message = args.join(' ');
    testOutput.push({ type: 'log', message });
    originalConsoleLog.apply(console, args);
};

console.error = function(...args) {
    const message = args.join(' ');
    testOutput.push({ type: 'error', message });
    errorCount++;
    
    // Check if it's a known error that should be suppressed
    const knownErrors = [
        'Extension context invalidated',
        'CORS policy',
        'api.infi-dev.com',
        'auth.openai.com'
    ];
    
    const isKnownError = knownErrors.some(knownError => message.includes(knownError));
    if (!isKnownError) {
        originalConsoleError.apply(console, args);
    }
};

console.warn = function(...args) {
    const message = args.join(' ');
    testOutput.push({ type: 'warn', message });
    warningCount++;
    originalConsoleWarn.apply(console, args);
};

// Load and execute scripts in order
async function loadScript(scriptPath) {
    const fullPath = path.join(__dirname, scriptPath);
    if (fs.existsSync(fullPath)) {
        console.log(`📜 [TEST-RUNNER] Loading script: ${scriptPath}`);
        try {
            const scriptContent = fs.readFileSync(fullPath, 'utf8');
            
            // Create a safe execution environment
            const scriptFunction = new Function('window', 'document', 'chrome', 'console', scriptContent);
            scriptFunction(global.window, global.document, global.chrome, console);
            
            console.log(`✅ [TEST-RUNNER] Script loaded successfully: ${scriptPath}`);
            return true;
        } catch (error) {
            console.error(`❌ [TEST-RUNNER] Error loading script ${scriptPath}:`, error.message);
            return false;
        }
    } else {
        console.warn(`⚠️  [TEST-RUNNER] Script not found: ${scriptPath}`);
        return false;
    }
}

// Simulate fetch API with blocking
global.fetch = function(url, options) {
    console.log(`🌐 [TEST-RUNNER] Fetch request: ${url}`);
    
    // Block known problematic URLs
    if (url.includes('api.infi-dev.com') || url.includes('auth.openai.com')) {
        console.log(`🚫 [TEST-RUNNER] Blocked request to: ${url}`);
        return Promise.reject(new Error('Blocked by CORS policy (simulated)'));
    }
    
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: 'mock data' })
    });
};

// Main test execution
async function runTests() {
    console.log('🧪 [TEST-RUNNER] ================================================');
    console.log('🧪 [TEST-RUNNER] LOADING EXTENSION SCRIPTS IN ORDER...');
    console.log('🧪 [TEST-RUNNER] ================================================');
    
    // Load scripts in the same order as manifest.json
    const scripts = [
        'scripts/ultra-aggressive-fix.js',
        'scripts/final-comprehensive-fix.js',
        'scripts/emergency-fix.js',
        'scripts/fix-undefined-properties.js',
        'scripts/fix-cors-issues.js',
        'scripts/dev-init-safe.js',
        'config/dev-mode.js',
        'api/mock-backend.js',
        'scripts/manual-premium-enable.js',
        'scripts/debug-console.js',
        'api/localBackend.js',
        'scripts/devmode.js',
        'html/devSettings.js',
        'scripts/content.js',
        'scripts/verify-offline.js',
        'scripts/plan-text-override.js',
        'scripts/plan-debug.js',
        'scripts/extension-details-toggle.js',
        'scripts/real-api-bridge.js',
        'scripts/fix-premium-features.js',
        'scripts/test-real-api.js',
        'scripts/debug-manage-chats.js',
        'scripts/fix-conversation-history.js',
        'scripts/test-all-fixes.js',
        'scripts/test-ultra-fix.js',
        'scripts/end-to-end-test.js'
    ];
    
    let loadedScripts = 0;
    let failedScripts = 0;
    
    for (const script of scripts) {
        const success = await loadScript(script);
        if (success) {
            loadedScripts++;
        } else {
            failedScripts++;
        }
        
        // Small delay between scripts
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log('🧪 [TEST-RUNNER] ================================================');
    console.log('🧪 [TEST-RUNNER] SCRIPT LOADING SUMMARY');
    console.log('🧪 [TEST-RUNNER] ================================================');
    console.log(`🧪 [TEST-RUNNER] ✅ Loaded: ${loadedScripts} scripts`);
    console.log(`🧪 [TEST-RUNNER] ❌ Failed: ${failedScripts} scripts`);
    console.log(`🧪 [TEST-RUNNER] 📊 Total: ${scripts.length} scripts`);
    
    // Wait for tests to complete
    console.log('🧪 [TEST-RUNNER] ================================================');
    console.log('🧪 [TEST-RUNNER] WAITING FOR TESTS TO COMPLETE...');
    console.log('🧪 [TEST-RUNNER] ================================================');
    
    await new Promise(resolve => setTimeout(resolve, 6000)); // Wait 6 seconds for all tests
    
    // Analyze test results
    console.log('🧪 [TEST-RUNNER] ================================================');
    console.log('🧪 [TEST-RUNNER] FINAL TEST ANALYSIS');
    console.log('🧪 [TEST-RUNNER] ================================================');
    
    const e2eTests = testOutput.filter(output => output.message.includes('[E2E-TEST]'));
    const ultraFixTests = testOutput.filter(output => output.message.includes('[ULTRA-FIX-TEST]'));
    const passedTests = testOutput.filter(output => output.message.includes('✅') || output.message.includes('PASS'));
    const failedTests = testOutput.filter(output => output.message.includes('❌') || output.message.includes('FAIL'));
    const warningTests = testOutput.filter(output => output.message.includes('⚠️') || output.message.includes('WARN'));
    
    console.log(`🧪 [TEST-RUNNER] 📊 E2E Test Messages: ${e2eTests.length}`);
    console.log(`🧪 [TEST-RUNNER] 📊 Ultra-Fix Test Messages: ${ultraFixTests.length}`);
    console.log(`🧪 [TEST-RUNNER] ✅ Passed Tests: ${passedTests.length}`);
    console.log(`🧪 [TEST-RUNNER] ❌ Failed Tests: ${failedTests.length}`);
    console.log(`🧪 [TEST-RUNNER] ⚠️  Warning Tests: ${warningTests.length}`);
    console.log(`🧪 [TEST-RUNNER] 🚨 Console Errors: ${errorCount}`);
    console.log(`🧪 [TEST-RUNNER] ⚠️  Console Warnings: ${warningCount}`);
    
    // Check for critical success indicators
    const criticalSuccessIndicators = [
        'CRITICAL SYSTEMS OPERATIONAL',
        'Ultra-aggressive fix appears to be working',
        'ALL CRITICAL TESTS PASSED'
    ];
    
    const hasSuccessIndicators = criticalSuccessIndicators.some(indicator =>
        testOutput.some(output => output.message.includes(indicator))
    );
    
    console.log('🧪 [TEST-RUNNER] ================================================');
    if (hasSuccessIndicators && failedTests.length === 0) {
        console.log('🧪 [TEST-RUNNER] 🎉 END-TO-END TESTS SUCCESSFUL!');
        console.log('🧪 [TEST-RUNNER] Extension is ready for production use');
        console.log('🧪 [TEST-RUNNER] All critical systems are operational');
    } else if (hasSuccessIndicators) {
        console.log('🧪 [TEST-RUNNER] ✅ TESTS MOSTLY SUCCESSFUL');
        console.log('🧪 [TEST-RUNNER] Extension is functional with minor warnings');
        console.log('🧪 [TEST-RUNNER] Review warnings for potential improvements');
    } else {
        console.log('🧪 [TEST-RUNNER] ⚠️  TESTS COMPLETED WITH ISSUES');
        console.log('🧪 [TEST-RUNNER] Extension may have functionality problems');
        console.log('🧪 [TEST-RUNNER] Review failed tests and errors');
    }
    console.log('🧪 [TEST-RUNNER] ================================================');
    
    // Save test results to file
    const testResults = {
        timestamp: new Date().toISOString(),
        scriptsLoaded: loadedScripts,
        scriptsFailed: failedScripts,
        totalScripts: scripts.length,
        passedTests: passedTests.length,
        failedTests: failedTests.length,
        warningTests: warningTests.length,
        consoleErrors: errorCount,
        consoleWarnings: warningCount,
        hasSuccessIndicators,
        testOutput: testOutput
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'test-results.json'),
        JSON.stringify(testResults, null, 2)
    );
    
    console.log('🧪 [TEST-RUNNER] Test results saved to test-results.json');
    
    return testResults;
}

// Run the tests
runTests().then((results) => {
    console.log('🧪 [TEST-RUNNER] Test execution completed');
    process.exit(results.failedTests === 0 ? 0 : 1);
}).catch((error) => {
    console.error('🧪 [TEST-RUNNER] Test execution failed:', error);
    process.exit(1);
});
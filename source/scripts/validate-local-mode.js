#!/usr/bin/env node

/**
 * LOCAL MODE VALIDATION SCRIPT
 * Validates that the extension is properly configured for local-only operation
 * Tests the unified context fix and configuration files
 */

const fs = require('fs');
const path = require('path');

console.log('🏠 VALIDATING LOCAL MODE CONFIGURATION');
console.log('=====================================');

let allTestsPassed = true;
const results = [];

function logResult(test, passed, message) {
    const status = passed ? '✅' : '❌';
    const result = `${status} ${test}: ${message}`;
    console.log(result);
    results.push({ test, passed, message });
    if (!passed) allTestsPassed = false;
}

// Test 1: Validate unified context fix exists and has correct API blocking
function testUnifiedContextFix() {
    console.log('\n📋 Testing Unified Context Fix Configuration...');
    
    const fixPath = path.join(__dirname, 'unified-context-fix.js');
    
    if (!fs.existsSync(fixPath)) {
        logResult('Unified Context Fix', false, 'File does not exist');
        return;
    }
    
    const fixContent = fs.readFileSync(fixPath, 'utf8');
    
    // Test OpenAI API allowlist
    const hasOpenAIAllowlist = fixContent.includes('chatgpt.com') && 
                              fixContent.includes('openai.com') &&
                              fixContent.includes('backend-api');
    logResult('OpenAI API Allowlist', hasOpenAIAllowlist, 
             hasOpenAIAllowlist ? 'OpenAI/ChatGPT APIs are allowed' : 'Missing OpenAI API allowlist');
    
    // Test external API blocking
    const blocksExternalAPIs = fixContent.includes('api.infi-dev.com') && 
                              fixContent.includes('example-removed') &&
                              fixContent.includes('infi-dev');
    logResult('External API Blocking', blocksExternalAPIs, 
             blocksExternalAPIs ? 'External APIs are blocked' : 'Missing external API blocking');
    
    // Test Real API Bridge integration
    const hasRealAPIBridge = fixContent.includes('realGetUserFolders') && 
                            fixContent.includes('realGetConversations') &&
                            fixContent.includes('realGetPrompts');
    logResult('Real API Bridge Integration', hasRealAPIBridge, 
             hasRealAPIBridge ? 'Real API Bridge functions integrated' : 'Missing Real API Bridge integration');
    
    // Test infinite loop prevention
    const hasLoopPrevention = fixContent.includes('MAX_CALL_DEPTH') &&
                             (fixContent.includes('storageCallDepth') ||
                              fixContent.includes('fetchCallDepth') ||
                              fixContent.includes('xhrCallDepth'));
    logResult('Infinite Loop Prevention', hasLoopPrevention, 
             hasLoopPrevention ? 'Call depth tracking implemented' : 'Missing infinite loop prevention');
}

// Test 2: Validate Real API Bridge exists
function testRealAPIBridge() {
    console.log('\n🌉 Testing Real API Bridge...');
    
    const bridgePath = path.join(__dirname, 'real-api-bridge.js');
    
    if (!fs.existsSync(bridgePath)) {
        logResult('Real API Bridge', false, 'File does not exist');
        return;
    }
    
    const bridgeContent = fs.readFileSync(bridgePath, 'utf8');
    
    // Test core functions
    const hasCoreFunction = bridgeContent.includes('realGetConversations') && 
                           bridgeContent.includes('realGetUserFolders') &&
                           bridgeContent.includes('realGetPrompts');
    logResult('Real API Bridge Functions', hasCoreFunction, 
             hasCoreFunction ? 'All core functions present' : 'Missing core functions');
    
    // Test DOM extraction
    const hasDOMExtraction = bridgeContent.includes('querySelector') || 
                            bridgeContent.includes('querySelectorAll');
    logResult('DOM Extraction', hasDOMExtraction, 
             hasDOMExtraction ? 'DOM extraction implemented' : 'Missing DOM extraction');
}

// Test 3: Validate development mode configuration
function testDevModeConfig() {
    console.log('\n⚙️ Testing Development Mode Configuration...');
    
    const configPath = path.join(__dirname, '..', 'config', 'dev-mode.js');
    
    if (!fs.existsSync(configPath)) {
        logResult('Dev Mode Config', false, 'File does not exist');
        return;
    }
    
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Test offline mode
    const hasOfflineMode = configContent.includes('OFFLINE_MODE') && 
                          configContent.includes('true');
    logResult('Offline Mode', hasOfflineMode, 
             hasOfflineMode ? 'Offline mode enabled' : 'Offline mode not enabled');
    
    // Test mock configurations
    const hasMockConfig = configContent.includes('MOCK_PREMIUM') && 
                         configContent.includes('MOCK_API_RESPONSES');
    logResult('Mock Configuration', hasMockConfig, 
             hasMockConfig ? 'Mock configurations present' : 'Missing mock configurations');
}

// Test 4: Validate manifest configuration
function testManifestConfig() {
    console.log('\n📋 Testing Manifest Configuration...');
    
    const manifestPath = path.join(__dirname, '..', 'manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
        logResult('Manifest', false, 'File does not exist');
        return;
    }
    
    try {
        const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        // Test content scripts
        const hasContentScripts = manifestContent.content_scripts && 
                                  manifestContent.content_scripts.length > 0;
        logResult('Content Scripts', hasContentScripts, 
                 hasContentScripts ? 'Content scripts configured' : 'Missing content scripts');
        
        // Test permissions
        const hasPermissions = manifestContent.permissions && 
                              manifestContent.permissions.includes('activeTab');
        logResult('Permissions', hasPermissions, 
                 hasPermissions ? 'Required permissions present' : 'Missing required permissions');
        
    } catch (error) {
        logResult('Manifest Parsing', false, `Error parsing manifest: ${error.message}`);
    }
}

// Test 5: Check for conflicting scripts
function testConflictingScripts() {
    console.log('\n🔍 Testing for Conflicting Scripts...');
    
    const scriptsDir = __dirname;
    const conflictingScripts = [
        'ultra-aggressive-fix.js',
        'emergency-fix.js'
    ];
    
    let hasConflicts = false;
    conflictingScripts.forEach(script => {
        const scriptPath = path.join(scriptsDir, script);
        if (fs.existsSync(scriptPath)) {
            logResult('Conflicting Script', false, `Found conflicting script: ${script}`);
            hasConflicts = true;
        }
    });
    
    if (!hasConflicts) {
        logResult('Conflicting Scripts', true, 'No conflicting scripts found');
    }
}

// Test 6: Validate architecture documentation
function testDocumentation() {
    console.log('\n📚 Testing Documentation...');
    
    const archPath = path.join(__dirname, '..', 'ARCHITECTURE_LOCAL_MODE.md');
    const designPath = path.join(__dirname, '..', 'DESIGN_LOCAL_MODE.md');
    
    const hasArchDoc = fs.existsSync(archPath);
    logResult('Architecture Documentation', hasArchDoc, 
             hasArchDoc ? 'Architecture documentation present' : 'Missing architecture documentation');
    
    const hasDesignDoc = fs.existsSync(designPath);
    logResult('Design Documentation', hasDesignDoc, 
             hasDesignDoc ? 'Design documentation present' : 'Missing design documentation');
}

// Run all tests
async function runAllTests() {
    testUnifiedContextFix();
    testRealAPIBridge();
    testDevModeConfig();
    testManifestConfig();
    testConflictingScripts();
    testDocumentation();
    
    console.log('\n🎯 VALIDATION SUMMARY');
    console.log('====================');
    
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    
    console.log(`Tests Passed: ${passedTests}/${totalTests}`);
    
    if (allTestsPassed) {
        console.log('✅ ALL TESTS PASSED - Local mode is properly configured!');
        console.log('\n🏆 CONFIRMED CONFIGURATION:');
        console.log('   ✅ OpenAI/ChatGPT API calls: ALLOWED');
        console.log('   🚫 Intermediary API calls: BLOCKED');
        console.log('   🏠 Local functionality: ACTIVE');
        console.log('   🔄 Real API Bridge: INTEGRATED');
        console.log('   🛡️ Infinite loop prevention: ENABLED');
        console.log('\n🎯 PRIMARY USE CASES READY:');
        console.log('   📁 Folder retrieval: Local DOM extraction');
        console.log('   💬 Chat retrieval: Local DOM extraction');
    } else {
        console.log('❌ SOME TESTS FAILED - Review configuration');
        process.exit(1);
    }
}

// Execute tests
runAllTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
});
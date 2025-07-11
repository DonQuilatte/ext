// Node.js test script to verify the extension fixes
/* eslint-disable no-console, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, no-unused-vars */
// This is a utility script that requires console output for user feedback and Node.js require statements
const fs = require('fs');
const path = require('path');

console.log('🧪 TESTING: Extension fixes verification (Node.js)');

// Test 1: Check if all required files exist
console.log('🔍 TEST 1: Checking required files exist...');
const requiredFiles = [
    'source/manifest.json',
    'source/scripts/robust-initialization.js',
    'source/scripts/content-fix.js',
    'source/scripts/unified-context-fix.js',
    'source/scripts/verify-offline.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ TEST 1: ${file} exists`);
    } else {
        console.log(`❌ TEST 1: ${file} missing`);
        allFilesExist = false;
    }
});

// Test 2: Check manifest.json structure
console.log('🔍 TEST 2: Checking manifest.json structure...');
try {
    const manifest = JSON.parse(fs.readFileSync('source/manifest.json', 'utf8'));
    
    if (manifest.content_scripts && manifest.content_scripts.length > 0) {
        console.log('✅ TEST 2: Content scripts defined');
        
        const contentScript = manifest.content_scripts[0];
        if (contentScript.js && contentScript.js.length > 0) {
            console.log(`✅ TEST 2: ${contentScript.js.length} JavaScript files in content scripts`);
            
            // Check script loading order
            const scriptOrder = contentScript.js;
            const robustInitIndex = scriptOrder.findIndex(s => s.includes('robust-initialization.js'));
            const unifiedContextIndex = scriptOrder.findIndex(s => s.includes('unified-context-fix.js'));
            const verifyOfflineIndex = scriptOrder.findIndex(s => s.includes('verify-offline.js'));
            
            if (robustInitIndex < unifiedContextIndex && unifiedContextIndex < verifyOfflineIndex) {
                console.log('✅ TEST 2: Script loading order is correct');
            } else {
                console.log('⚠️ TEST 2: Script loading order may be incorrect');
                console.log(`  - robust-initialization.js: position ${robustInitIndex}`);
                console.log(`  - unified-context-fix.js: position ${unifiedContextIndex}`);
                console.log(`  - verify-offline.js: position ${verifyOfflineIndex}`);
            }
        } else {
            console.log('❌ TEST 2: No JavaScript files in content scripts');
        }
    } else {
        console.log('❌ TEST 2: No content scripts defined');
    }
} catch (error) {
    console.log('❌ TEST 2: Error reading manifest.json:', error.message);
}

// Test 3: Check for configuration objects in robust-initialization.js
console.log('🔍 TEST 3: Checking configuration objects...');
try {
    const robustInitContent = fs.readFileSync('source/scripts/robust-initialization.js', 'utf8');
    
    if (robustInitContent.includes('DEV_MODE_CONFIG')) {
        console.log('✅ TEST 3: DEV_MODE_CONFIG found in robust-initialization.js');
    } else {
        console.log('❌ TEST 3: DEV_MODE_CONFIG not found in robust-initialization.js');
    }
    
    if (robustInitContent.includes('MOCK_BACKEND')) {
        console.log('✅ TEST 3: MOCK_BACKEND found in robust-initialization.js');
    } else {
        console.log('❌ TEST 3: MOCK_BACKEND not found in robust-initialization.js');
    }
    
    if (robustInitContent.includes('domUtils') && robustInitContent.includes('storageUtils')) {
        console.log('✅ TEST 3: Utility objects (domUtils, storageUtils) found');
    } else {
        console.log('❌ TEST 3: Utility objects not found');
    }
} catch (error) {
    console.log('❌ TEST 3: Error reading robust-initialization.js:', error.message);
}

// Test 4: Check for enhanced error handling in content-fix.js
console.log('🔍 TEST 4: Checking enhanced error handling...');
try {
    const contentFixContent = fs.readFileSync('source/scripts/content-fix.js', 'utf8');
    
    if (contentFixContent.includes('Cannot read properties of undefined')) {
        console.log('✅ TEST 4: Enhanced TypeError detection found');
    } else {
        console.log('❌ TEST 4: Enhanced TypeError detection not found');
    }
    
    if (contentFixContent.includes('window.isResetChatHistory = false')) {
        console.log('✅ TEST 4: Emergency property fallback found');
    } else {
        console.log('❌ TEST 4: Emergency property fallback not found');
    }
    
    if (contentFixContent.includes('🆘 CONTENT FIX: Created emergency')) {
        console.log('✅ TEST 4: Emergency fallback logging found');
    } else {
        console.log('❌ TEST 4: Emergency fallback logging not found');
    }
} catch (error) {
    console.log('❌ TEST 4: Error reading content-fix.js:', error.message);
}

// Test 5: Check for ai-toolbox removal
console.log('🔍 TEST 5: Checking ai-toolbox references removal...');
try {
    let aiToolboxFound = false;
    const filesToCheck = [
        'source/scripts/robust-initialization.js',
        'source/scripts/content-fix.js',
        'source/scripts/unified-context-fix.js'
    ];
    
    filesToCheck.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.toLowerCase().includes('ai-toolbox')) {
                console.log(`⚠️ TEST 5: ai-toolbox reference found in ${file}`);
                aiToolboxFound = true;
            }
        }
    });
    
    if (!aiToolboxFound) {
        console.log('✅ TEST 5: No ai-toolbox references found in key files');
    }
} catch (error) {
    console.log('❌ TEST 5: Error checking ai-toolbox references:', error.message);
}

// Test 6: Check file sizes (basic sanity check)
console.log('🔍 TEST 6: Checking file sizes...');
try {
    const fileSizes = {};
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            fileSizes[file] = stats.size;
            
            if (stats.size > 0) {
                console.log(`✅ TEST 6: ${file} has content (${stats.size} bytes)`);
            } else {
                console.log(`❌ TEST 6: ${file} is empty`);
            }
        }
    });
} catch (error) {
    console.log('❌ TEST 6: Error checking file sizes:', error.message);
}

console.log('🎯 TESTING: Extension fixes verification complete');

if (allFilesExist) {
    console.log('🎉 SUMMARY: All required files exist - extension should be ready for testing');
} else {
    console.log('⚠️ SUMMARY: Some files are missing - extension may not work properly');
}
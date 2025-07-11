#!/usr/bin/env node

/**
 * Verification script to check if menu functions are loaded with the extension
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function verifyFunctions() {
  console.log('🔍 Verifying menu function availability with extension...');
  
  const extensionPath = path.join(__dirname, 'dist');
  console.log(`📦 Extension path: ${extensionPath}`);
  
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      `--load-extension=${extensionPath}`,
      `--disable-extensions-except=${extensionPath}`
    ]
  });
  
  const page = await browser.newPage();
  
  // Set up console logging
  page.on('console', msg => {
    console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR] ${error.message}`);
  });
  
  try {
    console.log('🌐 Navigating to ChatGPT...');
    await page.goto('https://chatgpt.com', { waitUntil: 'networkidle2' });
    
    console.log('⏳ Waiting for page and extension to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🔍 Checking function availability...');
    const functionTest = await page.evaluate(() => {
      const functions = [
        'showManageChatsModal',
        'showManageFoldersModal', 
        'showManagePromptsModal',
        'showMediaGalleryModal'
      ];
      
      const results = {};
      functions.forEach(func => {
        results[func] = {
          exists: typeof window[func] === 'function',
          type: typeof window[func]
        };
      });
      
      // Also check what's available in the global scope
      const globalProps = Object.getOwnPropertyNames(window).filter(prop => 
        prop.includes('show') || prop.includes('Modal') || prop.includes('manage')
      );
      
      return {
        functionResults: results,
        globalProps: globalProps
      };
    });
    
    console.log('\n📊 Function availability results:');
    let allFunctionsExist = true;
    Object.entries(functionTest.functionResults).forEach(([func, result]) => {
      const status = result.exists ? '✅ EXISTS' : '❌ MISSING';
      console.log(`  ${func}: ${status} (type: ${result.type})`);
      if (!result.exists) {
        allFunctionsExist = false;
      }
    });
    
    console.log('\n🌐 Related global properties found:');
    functionTest.globalProps.forEach(prop => {
      console.log(`  ${prop}`);
    });
    
    if (allFunctionsExist) {
      console.log('\n🎉 SUCCESS: All menu functions are properly defined!');
      
      // Test calling one of the functions
      console.log('\n🧪 Testing function call...');
      await page.evaluate(() => {
        try {
          window.showManageChatsModal();
          console.log('✅ showManageChatsModal() called successfully');
        } catch (error) {
          console.error('❌ Error calling showManageChatsModal():', error);
        }
      });
      
    } else {
      console.log('\n❌ FAILURE: Some menu functions are missing.');
    }
    
    console.log('\n🔍 Keeping browser open for manual inspection...');
    console.log('Press Ctrl+C to close.');
    
    // Keep browser open for manual inspection
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
    return false;
  } finally {
    // Browser will close when process terminates
  }
}

// Run verification
verifyFunctions().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
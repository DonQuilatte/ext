#!/usr/bin/env node

/**
 * Quick verification script to check if menu functions are properly loaded
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function verifyFunctions() {
  console.log('🔍 Verifying menu function availability...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--load-extension=' + path.join(__dirname, 'source'),
      '--disable-extensions-except=' + path.join(__dirname, 'source')
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to ChatGPT
    await page.goto('https://chatgpt.com', { waitUntil: 'networkidle2' });
    
    // Wait for extension to load
    await page.waitForFunction(() => window.location.href.includes('chatgpt.com'), { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check function availability
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
      
      return results;
    });
    
    console.log('📊 Function availability results:');
    let allFunctionsExist = true;
    Object.entries(functionTest).forEach(([func, result]) => {
      const status = result.exists ? '✅ EXISTS' : '❌ MISSING';
      console.log(`  ${func}: ${status} (type: ${result.type})`);
      if (!result.exists) {
        allFunctionsExist = false;
      }
    });
    
    if (allFunctionsExist) {
      console.log('\n🎉 SUCCESS: All menu functions are properly defined!');
    } else {
      console.log('\n❌ FAILURE: Some menu functions are missing.');
    }
    
    return allFunctionsExist;
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
    return false;
  } finally {
    await browser.close();
  }
}

// Run verification
verifyFunctions().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
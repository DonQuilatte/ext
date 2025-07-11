#!/usr/bin/env node

/**
 * Script to run undefined error detection tests
 * This script will run comprehensive tests to detect and log undefined errors
 * when clicking on menu items: Manage Chats, Manage Folders, Manage Prompts, Media Gallery
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function runUndefinedErrorTests() {
  console.log('🚀 Starting undefined error detection tests...');
  
  let browser;
  try {
    // Launch browser with debugging enabled
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set up comprehensive error monitoring
    const errors = [];
    const undefinedErrors = [];
    const pageErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const errorMsg = msg.text();
        errors.push(errorMsg);
        
        if (errorMsg.includes('undefined') || 
            errorMsg.includes('is not a function') ||
            errorMsg.includes('Cannot read properties of undefined')) {
          undefinedErrors.push(errorMsg);
          console.log('❌ UNDEFINED ERROR:', errorMsg);
        }
      }
    });
    
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      if (error.message.includes('undefined')) {
        undefinedErrors.push(error.message);
        console.log('❌ PAGE UNDEFINED ERROR:', error.message);
      }
    });
    
    // Navigate to ChatGPT
    console.log('🌐 Navigating to ChatGPT...');
    await page.goto('https://chatgpt.com', { waitUntil: 'networkidle2' });
    
    // Wait for extension to load
    console.log('⏳ Waiting for extension to load...');
    await page.waitForTimeout(5000);
    
    // Test 1: Check if menu functions exist
    console.log('🔍 Test 1: Checking menu function availability...');
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
    Object.entries(functionTest).forEach(([func, result]) => {
      console.log(`  ${func}: ${result.exists ? '✅ EXISTS' : '❌ MISSING'} (type: ${result.type})`);
    });
    
    // Test 2: Try to call each function and capture errors
    console.log('🔍 Test 2: Attempting to call menu functions...');
    const callTest = await page.evaluate(() => {
      const functions = [
        'showManageChatsModal',
        'showManageFoldersModal',
        'showManagePromptsModal',
        'showMediaGalleryModal'
      ];
      
      const results = {};
      
      functions.forEach(func => {
        try {
          if (typeof window[func] === 'function') {
            window[func]();
            results[func] = { success: true, error: null };
          } else {
            results[func] = { success: false, error: `Function ${func} is undefined` };
          }
        } catch (error) {
          results[func] = { success: false, error: error.message };
        }
      });
      
      return results;
    });
    
    console.log('📊 Function call results:');
    Object.entries(callTest).forEach(([func, result]) => {
      console.log(`  ${func}: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });
    
    // Test 3: DOM inspection for menu elements
    console.log('🔍 Test 3: DOM inspection for menu elements...');
    const domTest = await page.evaluate(() => {
      const menuItems = ['Manage Chats', 'Manage Folders', 'Manage Prompts', 'Media Gallery'];
      const results = {
        potentialTriggers: [],
        suspiciousElements: []
      };
      
      // Look for elements that might trigger these functions
      const allElements = document.querySelectorAll('button, a, [onclick], [data-action]');
      
      allElements.forEach(element => {
        const text = element.textContent || element.title || element.ariaLabel || '';
        const onclick = element.onclick ? element.onclick.toString() : '';
        const dataAction = element.getAttribute('data-action') || '';
        
        // Check if element relates to menu items
        menuItems.forEach(menuItem => {
          if (text.toLowerCase().includes(menuItem.toLowerCase()) ||
              onclick.includes(menuItem.toLowerCase().replace(/\s+/g, '')) ||
              dataAction.includes(menuItem.toLowerCase().replace(/\s+/g, ''))) {
            results.potentialTriggers.push({
              menuItem,
              tagName: element.tagName,
              text: text.substring(0, 50),
              onclick: onclick.substring(0, 100),
              dataAction
            });
          }
        });
        
        // Check for suspicious undefined references
        if (onclick.includes('undefined') || 
            onclick.includes('showManageChatsModal') ||
            onclick.includes('showManageFoldersModal') ||
            onclick.includes('showManagePromptsModal') ||
            onclick.includes('showMediaGalleryModal')) {
          results.suspiciousElements.push({
            tagName: element.tagName,
            text: text.substring(0, 50),
            onclick: onclick.substring(0, 200)
          });
        }
      });
      
      return results;
    });
    
    console.log('📊 DOM inspection results:');
    console.log(`  Found ${domTest.potentialTriggers.length} potential menu triggers`);
    console.log(`  Found ${domTest.suspiciousElements.length} suspicious elements`);
    
    if (domTest.potentialTriggers.length > 0) {
      console.log('  🎯 Potential menu triggers:');
      domTest.potentialTriggers.forEach(trigger => {
        console.log(`    ${trigger.menuItem}: ${trigger.tagName} - "${trigger.text}"`);
      });
    }
    
    if (domTest.suspiciousElements.length > 0) {
      console.log('  🚨 Suspicious elements:');
      domTest.suspiciousElements.forEach(element => {
        console.log(`    ${element.tagName}: "${element.text}"`);
        console.log(`      onclick: ${element.onclick}`);
      });
    }
    
    // Test 4: Try to simulate clicks on found elements
    console.log('🔍 Test 4: Simulating clicks on potential triggers...');
    const clickTest = await page.evaluate(() => {
      const results = [];
      
      // Find buttons or links that might trigger menu functions
      const buttons = document.querySelectorAll('button, a, [onclick]');
      
      buttons.forEach(button => {
        const text = button.textContent || button.title || '';
        const menuItems = ['Manage Chats', 'Manage Folders', 'Manage Prompts', 'Media Gallery'];
        
        menuItems.forEach(menuItem => {
          if (text.toLowerCase().includes(menuItem.toLowerCase())) {
            try {
              // Try to click the element
              button.click();
              results.push({
                menuItem,
                success: true,
                text: text.substring(0, 50),
                error: null
              });
            } catch (error) {
              results.push({
                menuItem,
                success: false,
                text: text.substring(0, 50),
                error: error.message
              });
            }
          }
        });
      });
      
      return results;
    });
    
    console.log('📊 Click simulation results:');
    clickTest.forEach(result => {
      console.log(`  ${result.menuItem}: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });
    
    // Wait a bit more to capture any delayed errors
    await page.waitForTimeout(2000);
    
    // Final summary
    console.log('\n📋 FINAL SUMMARY:');
    console.log(`  Total errors captured: ${errors.length}`);
    console.log(`  Undefined errors: ${undefinedErrors.length}`);
    console.log(`  Page errors: ${pageErrors.length}`);
    
    if (undefinedErrors.length > 0) {
      console.log('\n🚨 UNDEFINED ERRORS FOUND:');
      undefinedErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    // Recommendations
    console.log('\n🔧 RECOMMENDATIONS:');
    Object.entries(functionTest).forEach(([func, result]) => {
      if (!result.exists) {
        console.log(`  - Function '${func}' is undefined. Check if extension scripts are properly loaded.`);
      }
    });
    
    if (domTest.suspiciousElements.length > 0) {
      console.log(`  - Found ${domTest.suspiciousElements.length} elements with suspicious onclick handlers.`);
    }
    
    if (undefinedErrors.length > 0) {
      console.log(`  - ${undefinedErrors.length} undefined errors detected. These need to be fixed.`);
    }
    
    console.log('\n✅ Undefined error detection test completed successfully!');
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection. Press Ctrl+C to close.');
    
    // Wait indefinitely to keep browser open
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Browser will be closed when process exits
  }
}

// Run the tests
runUndefinedErrorTests().catch(console.error);
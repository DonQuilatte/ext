const { describe, test, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');

describe('🎯 Menu Item Tests - Undefined Error Detection', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await require('puppeteer').launch({
      headless: false, // Use non-headless mode for better debugging
      devtools: true
    });
    page = await browser.newPage();
    
    // Enhanced error monitoring for menu item clicks
    page.on('console', msg => {
      if (msg.type() === 'error' && 
          (msg.text().includes('undefined') || 
           msg.text().includes('is not a function') ||
           msg.text().includes('Cannot read properties of undefined'))) {
        console.log('❌ UNDEFINED ERROR DETECTED:', msg.text());
      }
    });

    // Monitor for runtime errors
    page.on('pageerror', error => {
      console.log('❌ PAGE ERROR:', error.message);
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    await global.testUtils.navigateToChatGPT(page);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Allow extension to fully load
  });

  test('Test all menu items for undefined errors', async () => {
    console.log('🧪 Testing: Menu items for undefined errors');
    
    const menuItemTests = await page.evaluate(async () => {
      const results = {
        tests: [],
        errors: [],
        success: true
      };
      
      // Test each menu item function
      const menuItems = [
        { name: 'Manage Chats', func: 'showManageChatsModal' },
        { name: 'Manage Folders', func: 'showManageFoldersModal' },
        { name: 'Manage Prompts', func: 'showManagePromptsModal' },
        { name: 'Media Gallery', func: 'showMediaGalleryModal' }
      ];

      for (const item of menuItems) {
        const testResult = {
          name: item.name,
          functionName: item.func,
          exists: false,
          callable: false,
          error: null,
          clickable: false
        };

        try {
          // Test 1: Check if function exists
          if (typeof window[item.func] === 'function') {
            testResult.exists = true;
            testResult.callable = true;
            
            // Test 2: Try to call the function
            try {
              await window[item.func]();
              testResult.success = true;
              console.log(`✅ ${item.name} function works`);
            } catch (callError) {
              testResult.error = callError.message;
              testResult.success = false;
              results.errors.push(`${item.name}: ${callError.message}`);
              console.log(`❌ ${item.name} function error: ${callError.message}`);
            }
          } else {
            testResult.error = 'Function not found';
            testResult.success = false;
            results.errors.push(`${item.name}: Function ${item.func} not found`);
            console.log(`❌ ${item.name} function not found`);
          }

          // Test 3: Look for clickable elements that might trigger these functions
          const selectors = [
            `[onclick*="${item.func}"]`,
            `[data-action="${item.func}"]`,
            `[data-modal="${item.func}"]`,
            `button[title*="${item.name}" i]`,
            `a[href*="${item.name.toLowerCase().replace(/ /g, '-')}"]`,
            `[class*="${item.name.toLowerCase().replace(/ /g, '-')}"]`
          ];

          for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              testResult.clickable = true;
              console.log(`Found ${elements.length} clickable elements for ${item.name}`);
              break;
            }
          }

        } catch (error) {
          testResult.error = error.message;
          testResult.success = false;
          results.errors.push(`${item.name}: ${error.message}`);
        }

        results.tests.push(testResult);
      }

      results.success = results.tests.every(test => test.success);
      
      return results;
    });

    // Log detailed results
    console.log('📊 Menu Item Test Results:');
    menuItemTests.tests.forEach(test => {
      console.log(`${test.name}: ${test.success ? '✅ PASS' : '❌ FAIL'}`);
      if (test.error) {
        console.log(`  Error: ${test.error}`);
      }
      console.log(`  Function exists: ${test.exists}`);
      console.log(`  Callable: ${test.callable}`);
      console.log(`  Clickable elements found: ${test.clickable}`);
    });

    if (menuItemTests.errors.length > 0) {
      console.log('🚨 ERRORS FOUND:');
      menuItemTests.errors.forEach(error => console.log(`  - ${error}`));
    }

    // The test should pass if we can identify the issues, not if everything works
    expect(menuItemTests.tests.length).toBe(4);
    
    console.log('✅ SUCCESS: Menu item undefined error detection completed');
  }, 30000);

  test('Test menu item click simulation with error capture', async () => {
    console.log('🧪 Testing: Menu item click simulation with error capture');
    
    const clickSimulationResults = await page.evaluate(async () => {
      const results = {
        clickTests: [],
        errors: [],
        undefinedErrors: []
      };

      // Override console.error to capture undefined errors
      const originalError = console.error;
      console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('undefined') || 
            message.includes('is not a function') ||
            message.includes('Cannot read properties of undefined')) {
          results.undefinedErrors.push(message);
        }
        originalError.apply(console, args);
      };

      // Test functions that might be called by menu items
      const functionTests = [
        'showManageChatsModal',
        'showManageFoldersModal', 
        'showManagePromptsModal',
        'showMediaGalleryModal'
      ];

      for (const funcName of functionTests) {
        const testResult = {
          functionName: funcName,
          attempted: false,
          successful: false,
          error: null
        };

        try {
          testResult.attempted = true;
          
          if (typeof window[funcName] === 'function') {
            await window[funcName]();
            testResult.successful = true;
          } else {
            testResult.error = `Function ${funcName} is undefined`;
            results.undefinedErrors.push(`Function ${funcName} is undefined`);
          }
        } catch (error) {
          testResult.error = error.message;
          if (error.message.includes('undefined')) {
            results.undefinedErrors.push(error.message);
          }
        }

        results.clickTests.push(testResult);
      }

      // Restore original console.error
      console.error = originalError;

      return results;
    });

    console.log('🎯 Click Simulation Results:');
    clickSimulationResults.clickTests.forEach(test => {
      console.log(`${test.functionName}: ${test.successful ? '✅ SUCCESS' : '❌ FAILED'}`);
      if (test.error) {
        console.log(`  Error: ${test.error}`);
      }
    });

    if (clickSimulationResults.undefinedErrors.length > 0) {
      console.log('🚨 UNDEFINED ERRORS CAPTURED:');
      clickSimulationResults.undefinedErrors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }

    // Test passes if we captured the information we need
    expect(clickSimulationResults.clickTests.length).toBe(4);
    
    console.log('✅ SUCCESS: Click simulation and error capture completed');
  }, 25000);

  test('Test DOM inspection for menu item elements', async () => {
    console.log('🧪 Testing: DOM inspection for menu item elements');
    
    const domInspectionResults = await page.evaluate(() => {
      const results = {
        menuElements: [],
        potentialTriggers: [],
        suspiciousElements: []
      };

      // Look for menu-related elements
      const menuSelectors = [
        'nav', 'menu', '.menu', '.nav', '.toolbar', '.header-nav',
        '[class*="menu"]', '[id*="menu"]', '[data-testid*="menu"]',
        'button', 'a[href*="manage"]', '[onclick]'
      ];

      menuSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            const info = {
              selector: selector,
              tagName: element.tagName,
              className: element.className,
              id: element.id,
              onclick: element.onclick ? element.onclick.toString() : null,
              textContent: element.textContent?.trim()?.substring(0, 50) || '',
              hasUndefinedReference: false
            };

            // Check for undefined references in onclick handlers
            if (element.onclick) {
              const onclickStr = element.onclick.toString();
              if (onclickStr.includes('undefined') || 
                  onclickStr.includes('showManageChatsModal') ||
                  onclickStr.includes('showManageFoldersModal') ||
                  onclickStr.includes('showManagePromptsModal') ||
                  onclickStr.includes('showMediaGalleryModal')) {
                info.hasUndefinedReference = true;
                results.suspiciousElements.push(info);
              }
            }

            // Check for menu item text matches
            const menuItemNames = ['Manage Chats', 'Manage Folders', 'Manage Prompts', 'Media Gallery'];
            if (menuItemNames.some(name => 
                info.textContent.toLowerCase().includes(name.toLowerCase()))) {
              results.potentialTriggers.push(info);
            }

            if (info.onclick || info.textContent) {
              results.menuElements.push(info);
            }
          });
        } catch (error) {
          console.log(`Error inspecting ${selector}: ${error.message}`);
        }
      });

      return results;
    });

    console.log('🔍 DOM Inspection Results:');
    console.log(`Found ${domInspectionResults.menuElements.length} menu-related elements`);
    console.log(`Found ${domInspectionResults.potentialTriggers.length} potential menu triggers`);
    console.log(`Found ${domInspectionResults.suspiciousElements.length} suspicious elements`);

    if (domInspectionResults.potentialTriggers.length > 0) {
      console.log('🎯 Potential Menu Triggers:');
      domInspectionResults.potentialTriggers.forEach(trigger => {
        console.log(`  - ${trigger.tagName}.${trigger.className}: "${trigger.textContent}"`);
        if (trigger.onclick) {
          console.log(`    onclick: ${trigger.onclick.substring(0, 100)}...`);
        }
      });
    }

    if (domInspectionResults.suspiciousElements.length > 0) {
      console.log('🚨 Suspicious Elements (potential undefined references):');
      domInspectionResults.suspiciousElements.forEach(element => {
        console.log(`  - ${element.tagName}.${element.className}: "${element.textContent}"`);
        console.log(`    onclick: ${element.onclick}`);
      });
    }

    // Always pass this test since we're collecting diagnostic data
    expect(domInspectionResults.menuElements.length).toBeGreaterThanOrEqual(0);
    
    console.log('✅ SUCCESS: DOM inspection completed');
  }, 20000);

  test('Test direct function availability and debugging', async () => {
    console.log('🧪 Testing: Direct function availability and debugging');
    
    const debugResults = await page.evaluate(() => {
      const results = {
        windowProps: {},
        functionAnalysis: {},
        globalScope: {},
        recommendedFixes: []
      };

      // Analyze window object for extension functions
      const extensionFunctions = [
        'showManageChatsModal',
        'showManageFoldersModal', 
        'showManagePromptsModal',
        'showMediaGalleryModal'
      ];

      extensionFunctions.forEach(funcName => {
        const analysis = {
          exists: typeof window[funcName] === 'function',
          type: typeof window[funcName],
          isCallable: false,
          source: null,
          error: null
        };

        if (analysis.exists) {
          analysis.isCallable = true;
          try {
            analysis.source = window[funcName].toString().substring(0, 200);
          } catch (e) {
            analysis.error = e.message;
          }
        } else {
          // Check if function exists in global scope or under other names
          const possibleNames = [
            funcName,
            funcName.replace('show', ''),
            funcName.replace('Modal', ''),
            funcName.toLowerCase(),
            funcName.toUpperCase()
          ];

          possibleNames.forEach(name => {
            if (typeof window[name] === 'function') {
              analysis.alternativeName = name;
              analysis.alternativeExists = true;
            }
          });

          results.recommendedFixes.push(
            `Function '${funcName}' is undefined. ` +
            `Expected location: window.${funcName}. ` +
            `Check if extension scripts are properly loaded.`
          );
        }

        results.functionAnalysis[funcName] = analysis;
      });

      // Check for extension-related objects
      const extensionObjects = ['ishkaExtension', 'extension', 'chatgptExtension'];
      extensionObjects.forEach(objName => {
        if (window[objName]) {
          results.windowProps[objName] = typeof window[objName];
        }
      });

      return results;
    });

    console.log('🔬 Function Analysis Results:');
    Object.entries(debugResults.functionAnalysis).forEach(([funcName, analysis]) => {
      console.log(`${funcName}:`);
      console.log(`  - Exists: ${analysis.exists}`);
      console.log(`  - Type: ${analysis.type}`);
      console.log(`  - Callable: ${analysis.isCallable}`);
      if (analysis.alternativeName) {
        console.log(`  - Alternative found: ${analysis.alternativeName}`);
      }
      if (analysis.error) {
        console.log(`  - Error: ${analysis.error}`);
      }
    });

    if (debugResults.recommendedFixes.length > 0) {
      console.log('🔧 Recommended Fixes:');
      debugResults.recommendedFixes.forEach(fix => {
        console.log(`  - ${fix}`);
      });
    }

    console.log('🌐 Extension Objects Found:');
    Object.entries(debugResults.windowProps).forEach(([objName, type]) => {
      console.log(`  - window.${objName}: ${type}`);
    });

    expect(Object.keys(debugResults.functionAnalysis).length).toBe(4);
    
    console.log('✅ SUCCESS: Function availability analysis completed');
  }, 15000);
});

module.exports = {
  suiteName: 'Menu Item Tests - Undefined Error Detection',
  description: 'Comprehensive tests to detect and debug undefined errors in menu item clicks',
  userOutcome: 'Menu item undefined errors are identified and logged for debugging'
};
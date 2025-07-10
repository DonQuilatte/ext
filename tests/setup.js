const path = require('path');

// Global test setup for Ishka Extension testing
global.testConfig = {
  extensionPath: path.resolve(__dirname, '../source'),
  chatgptUrl: 'https://chatgpt.com',
  testTimeout: 30000,
  // User-focused success criteria
  userSuccessCriteria: {
    canAccessExtension: 'User can see and interact with extension popup',
    canManageFolders: 'User can create, view, and manage folders',
    canManageChats: 'User can access and organize chat history',
    canUsePrompts: 'User can access and use prompt library',
    performanceGood: 'Extension loads within 3 seconds',
    noErrors: 'No console errors that affect user experience'
  }
};

// Utility functions for extension testing
global.testUtils = {
  // Wait for extension to load
  async waitForExtension(page) {
    try {
      // Wait for extension popup to be accessible
      await page.goto('chrome-extension://extension-popup');
      await page.waitForSelector('[data-testid="extension-popup"]', { 
        timeout: 10000 
      }).catch(() => {
        // Fallback: try to access extension via toolbar
        return page.evaluate(() => {
          return new Promise((resolve) => {
            chrome.runtime.sendMessage({action: 'ping'}, (response) => {
              resolve(response);
            });
          });
        });
      });
      return true;
    } catch (error) {
      console.warn('Extension not fully loaded:', error.message);
      return false;
    }
  },

  // Navigate to ChatGPT and wait for page load
  async navigateToChatGPT(page) {
    await page.goto(global.testConfig.chatgptUrl, { 
      waitUntil: 'networkidle2',
      timeout: global.testConfig.testTimeout 
    });
    
    // Wait for ChatGPT interface to load
    await page.waitForSelector('[data-testid="chat-input"], textarea[placeholder*="Message"]', { 
      timeout: 15000 
    }).catch(() => {
      console.warn('ChatGPT interface may not be fully loaded');
    });
  },

  // Check if extension is working by looking for its UI elements
  async isExtensionWorking(page) {
    try {
      // Look for extension-specific elements in the page
      const extensionElements = await page.evaluate(() => {
        const elements = {
          folderButtons: document.querySelectorAll('[class*="ishka"], [id*="ishka"]').length,
          extensionUI: document.querySelector('[data-extension="ishka"]') !== null,
          premiumFeatures: document.querySelectorAll('[class*="premium"], [class*="toolbox"]').length
        };
        return elements;
      });
      
      return extensionElements.folderButtons > 0 || 
             extensionElements.extensionUI || 
             extensionElements.premiumFeatures > 0;
    } catch (error) {
      return false;
    }
  },

  // Measure page performance
  async measurePerformance(page) {
    const metrics = await page.metrics();
    const timing = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime
      };
    });
    
    return {
      jsHeapUsedSize: metrics.JSHeapUsedSize,
      jsHeapTotalSize: metrics.JSHeapTotalSize,
      ...timing
    };
  },

  // Check for console errors that affect user experience
  async getConsoleErrors(page) {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        // Filter out known harmless errors
        const harmlessErrors = [
          'Extension context invalidated',
          'chrome-extension://',
          'Failed to load resource: net::ERR_EXTENSION_CONTEXT_INVALIDATED'
        ];
        
        if (!harmlessErrors.some(harmless => errorText.includes(harmless))) {
          errors.push(errorText);
        }
      }
    });
    
    return errors;
  }
};

// Configure test environment
beforeAll(async () => {
  console.log('🚀 Setting up Ishka Extension Test Environment');
  console.log(`📁 Extension Path: ${global.testConfig.extensionPath}`);
  console.log(`🌐 ChatGPT URL: ${global.testConfig.chatgptUrl}`);
  
  // Set default timeout for all tests
  jest.setTimeout(global.testConfig.testTimeout);
});

afterAll(async () => {
  console.log('🏁 Cleaning up test environment');
});

// Setup for each test
beforeEach(async () => {
  // Clear any previous test state
  if (global.page) {
    try {
      const url = await global.page.url();
      // Only attempt to clear storage on allowed origins
      if (url.startsWith('http') || url.startsWith('chrome-extension://')) {
        await global.page.evaluate(() => {
          try {
            localStorage.clear();
          } catch (e) {}
          try {
            sessionStorage.clear();
          } catch (e) {}
        });
      }
    } catch (err) {
      // Ignore errors (e.g., DOMException)
    }
  }
});

module.exports = {};
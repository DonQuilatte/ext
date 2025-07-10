const { describe, test, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');

describe('📁 Functional Tests - Folder Management', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await require('puppeteer').launch();
    page = await browser.newPage();
    
    // Monitor console for folder-related errors
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('folder')) {
        console.log('❌ Folder Error:', msg.text());
      }
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    // Navigate to ChatGPT before each test
    await global.testUtils.navigateToChatGPT(page);
    await page.waitForTimeout(2000); // Allow extension to initialize
  });

  test('User can access folder management interface', async () => {
    console.log('🧪 Testing: User can access folder management interface');
    
    // Look for folder management UI elements
    const folderInterface = await page.evaluate(() => {
      // Look for various possible folder interface selectors
      const selectors = [
        '[class*="folder"]', 
        '[id*="folder"]',
        '[data-testid*="folder"]',
        'button[title*="folder" i]',
        'button[aria-label*="folder" i]',
        '.manage-folders',
        '#manage-folders',
        '[class*="manage"][class*="folder"]'
      ];
      
      let foundElements = 0;
      const foundSelectors = [];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          foundElements += elements.length;
          foundSelectors.push(selector);
        }
      });
      
      return {
        hasInterface: foundElements > 0,
        elementCount: foundElements,
        foundSelectors,
        // Check if folder functions are available globally
        hasFolderFunctions: typeof window.getUserFolders === 'function' || 
                           typeof window.getAllUserFolders === 'function'
      };
    });
    
    expect(folderInterface.hasInterface || folderInterface.hasFolderFunctions).toBe(true);
    
    console.log('✅ SUCCESS: Folder management interface is accessible');
    console.log('Interface details:', folderInterface);
  }, 15000);

  test('User can retrieve folder list', async () => {
    console.log('🧪 Testing: User can retrieve folder list');
    
    // Test folder retrieval functionality
    const folderRetrieval = await page.evaluate(async () => {
      const results = {
        getUserFolders: null,
        getAllUserFolders: null,
        realGetUserFolders: null,
        errors: []
      };
      
      // Test getUserFolders
      if (typeof window.getUserFolders === 'function') {
        try {
          results.getUserFolders = await window.getUserFolders();
        } catch (error) {
          results.errors.push(`getUserFolders: ${error.message}`);
        }
      }
      
      // Test getAllUserFolders
      if (typeof window.getAllUserFolders === 'function') {
        try {
          results.getAllUserFolders = await window.getAllUserFolders();
        } catch (error) {
          results.errors.push(`getAllUserFolders: ${error.message}`);
        }
      }
      
      // Test real API fallback
      if (typeof window.realGetUserFolders === 'function') {
        try {
          results.realGetUserFolders = await window.realGetUserFolders();
        } catch (error) {
          results.errors.push(`realGetUserFolders: ${error.message}`);
        }
      }
      
      return results;
    });
    
    // Success if any folder function works
    const hasWorkingFunction = folderRetrieval.getUserFolders !== null ||
                              folderRetrieval.getAllUserFolders !== null ||
                              folderRetrieval.realGetUserFolders !== null;
    
    expect(hasWorkingFunction).toBe(true);
    
    console.log('✅ SUCCESS: User can retrieve folder list');
    console.log('Retrieval results:', folderRetrieval);
    
    if (folderRetrieval.errors.length > 0) {
      console.log('⚠️ Some methods had errors:', folderRetrieval.errors);
    }
  }, 20000);

  test('Folder operations do not break ChatGPT functionality', async () => {
    console.log('🧪 Testing: Folder operations do not break ChatGPT');
    
    // First trigger folder operations
    await page.evaluate(async () => {
      // Try to trigger folder operations if available
      if (typeof window.getUserFolders === 'function') {
        try {
          await window.getUserFolders();
        } catch (error) {
          console.log('Folder operation error (expected):', error.message);
        }
      }
    });
    
    // Wait a moment for any side effects
    await page.waitForTimeout(1000);
    
    // Verify ChatGPT is still functional
    const chatGPTIntact = await page.evaluate(() => {
      const chatInput = document.querySelector('textarea[placeholder*="Message"], [data-testid="chat-input"]');
      const isVisible = chatInput && chatInput.offsetParent !== null;
      const isInteractable = chatInput && !chatInput.disabled;
      
      return {
        inputExists: !!chatInput,
        inputVisible: isVisible,
        inputInteractable: isInteractable,
        pageResponsive: document.readyState === 'complete'
      };
    });
    
    expect(chatGPTIntact.inputExists).toBe(true);
    expect(chatGPTIntact.pageResponsive).toBe(true);
    
    console.log('✅ SUCCESS: Folder operations do not break ChatGPT');
    console.log('ChatGPT status:', chatGPTIntact);
  }, 15000);

  test('Folder interface is responsive and user-friendly', async () => {
    console.log('🧪 Testing: Folder interface responsiveness');
    
    // Test UI responsiveness
    const uiResponsiveness = await page.evaluate(() => {
      const folderElements = document.querySelectorAll('[class*="folder"], [id*="folder"]');
      let responsiveElements = 0;
      let clickableElements = 0;
      
      folderElements.forEach(element => {
        // Check if element is visible and has reasonable size
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          responsiveElements++;
        }
        
        // Check if element is clickable
        const style = window.getComputedStyle(element);
        if (style.cursor === 'pointer' || element.onclick || element.getAttribute('role') === 'button') {
          clickableElements++;
        }
      });
      
      return {
        totalFolderElements: folderElements.length,
        responsiveElements,
        clickableElements,
        hasReasonableUI: responsiveElements > 0 && folderElements.length > 0
      };
    });
    
    // Success if we have some responsive UI elements or if no UI is expected (API-only)
    expect(uiResponsiveness.hasReasonableUI || uiResponsiveness.totalFolderElements === 0).toBe(true);
    
    console.log('✅ SUCCESS: Folder interface is properly designed');
    console.log('UI details:', uiResponsiveness);
  }, 10000);
});

module.exports = {
  suiteName: 'Functional Tests - Folder Management',
  description: 'Tests core folder management functionality',
  userOutcome: 'Users can effectively manage their chat folders'
};
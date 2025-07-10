import { stateManager } from '@shared/state';
import { domUtils, storageUtils } from '@shared/utils';

console.log('🎯 Ishka Extension Content Script Initialized');

// Main initialization function
async function initializeContentScript(): Promise<void> {
  try {
    console.log('🚀 Starting content script initialization...');
    
    // Wait for the page to be fully loaded
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }
    
    // Initialize core features
    await initializeCoreFeatures();
    
    // Load premium features if enabled
    await loadPremiumFeatures();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize UI components
    await initializeUIComponents();
    
    console.log('✅ Content script initialization complete');
  } catch (error) {
    console.error('❌ Content script initialization failed:', error);
  }
}

// Initialize core features
async function initializeCoreFeatures(): Promise<void> {
  console.log('🔧 Initializing core features...');
  
  // Check if we're on a ChatGPT page
  if (!window.location.hostname.includes('chatgpt.com')) {
    console.log('⚠️ Not on ChatGPT page, skipping initialization');
    return;
  }
  
  // Initialize state manager
  await stateManager.updateUser({
    isLoggedIn: await checkUserLoginStatus(),
  });
  
  // Load conversations and folders
  await loadConversations();
  
  console.log('✅ Core features initialized');
}

// Check if user is logged in
async function checkUserLoginStatus(): Promise<boolean> {
  try {
    // Check for common login indicators
    const loginIndicators = [
      '[data-testid="user-menu"]',
      '.user-menu',
      '[data-testid="user-avatar"]',
      '.avatar',
    ];
    
    for (const selector of loginIndicators) {
      if (document.querySelector(selector)) {
        return true;
      }
    }
    
    // Check for logout button (indicates logged in)
    const logoutButton = document.querySelector('[data-testid="logout-button"]');
    if (logoutButton) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
}

// Load conversations from the page
async function loadConversations(): Promise<void> {
  try {
    console.log('📚 Loading conversations...');
    
    // Wait for conversation list to be available
    const conversationList = await domUtils.waitForElement('[data-testid="conversation-list"]', 10000);
    
    if (conversationList) {
      // Extract conversations from the DOM
      const conversationElements = conversationList.querySelectorAll('[data-testid="conversation-item"]');
      const conversations = Array.from(conversationElements as NodeListOf<Element>).map((element: Element) => {
        const titleElement = element.querySelector('[data-testid="conversation-title"]');
        const id = element.getAttribute('data-conversation-id') || '';
        const title = titleElement?.textContent || 'Untitled';
        
        return {
          id,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPinned: false,
          tags: [],
        };
      });
      
      await stateManager.updateConversations({ conversations });
      console.log(`✅ Loaded ${conversations.length} conversations`);
    }
  } catch (error) {
    console.error('❌ Failed to load conversations:', error);
  }
}

// Load premium features
async function loadPremiumFeatures(): Promise<void> {
  try {
    const state = stateManager.getState();
    
    if (state.user.isPremium) {
      console.log('💎 Loading premium features...');
      
      // Load premium features dynamically
      await loadModule('./features/premium');
      
      console.log('✅ Premium features loaded');
    } else {
      console.log('ℹ️ Premium features not enabled');
    }
  } catch (error) {
    console.error('❌ Failed to load premium features:', error);
  }
}

// Load module dynamically
async function loadModule(modulePath: string): Promise<void> {
  try {
    // This would be replaced with actual dynamic module loading
    // For now, we'll just log the attempt
    console.log(`📦 Loading module: ${modulePath}`);
  } catch (error) {
    console.error(`❌ Failed to load module ${modulePath}:`, error);
  }
}

// Set up event listeners
function setupEventListeners(): void {
  console.log('🎧 Setting up event listeners...');
  
  // Listen for DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        handleDOMChanges(mutation);
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender)
      .then(sendResponse)
      .catch((error) => {
        console.error('❌ Error handling message:', error);
        sendResponse({ error: error.message });
      });
    
    return true;
  });
  
  console.log('✅ Event listeners set up');
}

// Handle DOM changes
function handleDOMChanges(mutation: MutationRecord): void {
  // Check for new conversations
  if (mutation.addedNodes.length > 0) {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        
        // Check if new conversation was added
        if (element.getAttribute('data-testid') === 'conversation-item') {
          console.log('🆕 New conversation detected');
          loadConversations();
        }
        
        // Check if plan text needs to be updated
        if (element.textContent?.includes('Toolbox Plan - Free')) {
          console.log('🔄 Plan text detected, updating...');
          updatePlanText();
        }
      }
    });
  }
}

// Update plan text (premium feature simulation)
function updatePlanText(): void {
  try {
    const planElements = document.querySelectorAll('[data-testid="plan-text"]');
    
    planElements.forEach((element) => {
      if (element.textContent?.includes('Toolbox Plan - Free')) {
        element.textContent = element.textContent.replace('Free', 'Premium');
        element.classList.add('toolbox-plan-premium');
        console.log('✅ Plan text updated to Premium');
      }
    });
  } catch (error) {
    console.error('❌ Failed to update plan text:', error);
  }
}

// Handle messages
async function handleMessage(message: any, sender: chrome.runtime.MessageSender): Promise<any> {
  const { type, payload } = message;
  
  switch (type) {
    case 'GET_STATE':
      return { state: stateManager.getState() };
      
    case 'UPDATE_PLAN_TEXT':
      updatePlanText();
      return { success: true };
      
    case 'ENABLE_PREMIUM':
      await enablePremiumFeatures();
      return { success: true };
      
    case 'DISABLE_PREMIUM':
      await disablePremiumFeatures();
      return { success: true };
      
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}

// Enable premium features
async function enablePremiumFeatures(): Promise<void> {
  try {
    console.log('💎 Enabling premium features...');
    
    await stateManager.updateUser({ isPremium: true });
    await storageUtils.set('DEV_MODE_PREMIUM', true);
    await storageUtils.set('MOCK_PREMIUM', true);
    
    // Update plan text
    updatePlanText();
    
    // Reload premium features
    await loadPremiumFeatures();
    
    console.log('✅ Premium features enabled');
  } catch (error) {
    console.error('❌ Failed to enable premium features:', error);
  }
}

// Disable premium features
async function disablePremiumFeatures(): Promise<void> {
  try {
    console.log('🔒 Disabling premium features...');
    
    await stateManager.updateUser({ isPremium: false });
    await storageUtils.remove('DEV_MODE_PREMIUM');
    await storageUtils.remove('MOCK_PREMIUM');
    
    console.log('✅ Premium features disabled');
  } catch (error) {
    console.error('❌ Failed to disable premium features:', error);
  }
}

// Initialize UI components
async function initializeUIComponents(): Promise<void> {
  try {
    console.log('🎨 Initializing UI components...');
    
    // Add extension styles
    injectExtensionStyles();
    
    // Create extension UI elements
    await createExtensionUI();
    
    console.log('✅ UI components initialized');
  } catch (error) {
    console.error('❌ Failed to initialize UI components:', error);
  }
}

// Inject extension styles
function injectExtensionStyles(): void {
  const styles = `
    .ishka-extension {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .ishka-extension .toolbox-plan-premium {
      color: #10a37f;
      font-weight: 600;
    }
    
    .ishka-extension .premium-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
  `;
  
  domUtils.injectStyle(styles);
}

// Create extension UI
async function createExtensionUI(): Promise<void> {
  try {
    // Create extension container
    const container = document.createElement('div');
    container.className = 'ishka-extension';
    container.id = 'ishka-extension-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      font-size: 14px;
    `;
    
    // Add extension info
    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="font-weight: 600; color: #10a37f;">Ishka</span>
        <span class="premium-badge">v3.9.7</span>
      </div>
      <div style="font-size: 12px; color: #666;">
        Enhanced ChatGPT Experience
      </div>
    `;
    
    document.body.appendChild(container);
    
    console.log('✅ Extension UI created');
  } catch (error) {
    console.error('❌ Failed to create extension UI:', error);
  }
}

// Start initialization
initializeContentScript().catch((error) => {
  console.error('❌ Content script initialization failed:', error);
});

// Export functions for debugging
(window as any).ishkaExtension = {
  enablePremium: enablePremiumFeatures,
  disablePremium: disablePremiumFeatures,
  updatePlanText,
  getState: () => stateManager.getState(),
  setState: (partial: any) => stateManager.setState(partial),
};

console.log('🎯 Content script loaded and ready');
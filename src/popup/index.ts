import { stateManager } from '@shared/state';
import { storageUtils } from '@shared/utils';

console.log('🎯 Ishka Extension Popup Initialized');

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 Initializing popup...');
    
    // Initialize popup UI
    await initializePopupUI();
    
    // Set up event listeners
    setupPopupEventListeners();
    
    // Load current state
    await loadCurrentState();
    
    console.log('✅ Popup initialization complete');
  } catch (error) {
    console.error('❌ Popup initialization failed:', error);
  }
});

// Initialize popup UI
async function initializePopupUI(): Promise<void> {
  try {
    console.log('🎨 Setting up popup UI...');
    
    // Create main container
    const container = document.createElement('div');
    container.id = 'ishka-popup-container';
    container.className = 'ishka-popup';
    container.style.cssText = `
      width: 320px;
      min-height: 400px;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
    `;
    
    // Add header
    const header = createHeader();
    container.appendChild(header);
    
    // Add content sections
    const content = createContent();
    container.appendChild(content);
    
    // Add footer
    const footer = createFooter();
    container.appendChild(footer);
    
    // Replace existing content
    document.body.innerHTML = '';
    document.body.appendChild(container);
    
    console.log('✅ Popup UI created');
  } catch (error) {
    console.error('❌ Failed to create popup UI:', error);
  }
}

// Create header section
function createHeader(): HTMLElement {
  const header = document.createElement('div');
  header.className = 'popup-header';
  header.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e5e5;
  `;
  
  header.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px;"></div>
      <div>
        <div style="font-weight: 600; font-size: 16px; color: #333;">Ishka</div>
        <div style="font-size: 12px; color: #666;">Enhanced ChatGPT</div>
      </div>
    </div>
    <div id="premium-status" style="font-size: 12px; padding: 4px 8px; border-radius: 12px; background: #f0f0f0; color: #666;">
      Free
    </div>
  `;
  
  return header;
}

// Create content section
function createContent(): HTMLElement {
  const content = document.createElement('div');
  content.className = 'popup-content';
  content.style.cssText = `
    flex: 1;
    margin-bottom: 16px;
  `;
  
  content.innerHTML = `
    <div class="content-section">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #333;">Quick Actions</h3>
      <div class="action-buttons" style="display: flex; flex-direction: column; gap: 8px;">
        <button id="enable-premium" class="action-btn" style="
          padding: 8px 12px;
          border: 1px solid #10a37f;
          background: #10a37f;
          color: white;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        ">Enable Premium Features</button>
        <button id="update-plan-text" class="action-btn" style="
          padding: 8px 12px;
          border: 1px solid #e5e5e5;
          background: white;
          color: #333;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        ">Update Plan Text</button>
        <button id="refresh-conversations" class="action-btn" style="
          padding: 8px 12px;
          border: 1px solid #e5e5e5;
          background: white;
          color: #333;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        ">Refresh Conversations</button>
      </div>
    </div>
    
    <div class="content-section" style="margin-top: 20px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #333;">Status</h3>
      <div id="status-info" style="font-size: 12px; color: #666; line-height: 1.4;">
        Loading...
      </div>
    </div>
    
    <div class="content-section" style="margin-top: 20px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #333;">Debug</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button id="get-state" class="debug-btn" style="
          padding: 6px 10px;
          border: 1px solid #e5e5e5;
          background: white;
          color: #333;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
        ">Get State</button>
        <button id="clear-storage" class="debug-btn" style="
          padding: 6px 10px;
          border: 1px solid #e5e5e5;
          background: white;
          color: #333;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
        ">Clear Storage</button>
      </div>
    </div>
  `;
  
  return content;
}

// Create footer section
function createFooter(): HTMLElement {
  const footer = document.createElement('div');
  footer.className = 'popup-footer';
  footer.style.cssText = `
    padding-top: 12px;
    border-top: 1px solid #e5e5e5;
    font-size: 11px;
    color: #999;
    text-align: center;
  `;
  
  footer.innerHTML = `
    <div>Version 3.9.7</div>
    <div style="margin-top: 4px;">
      <a href="#" id="open-settings" style="color: #10a37f; text-decoration: none;">Settings</a> • 
      <a href="#" id="open-help" style="color: #10a37f; text-decoration: none;">Help</a>
    </div>
  `;
  
  return footer;
}

// Set up popup event listeners
function setupPopupEventListeners(): void {
  console.log('🎧 Setting up popup event listeners...');
  
  // Action buttons
  document.getElementById('enable-premium')?.addEventListener('click', handleEnablePremium);
  document.getElementById('update-plan-text')?.addEventListener('click', handleUpdatePlanText);
  document.getElementById('refresh-conversations')?.addEventListener('click', handleRefreshConversations);
  
  // Debug buttons
  document.getElementById('get-state')?.addEventListener('click', handleGetState);
  document.getElementById('clear-storage')?.addEventListener('click', handleClearStorage);
  
  // Footer links
  document.getElementById('open-settings')?.addEventListener('click', handleOpenSettings);
  document.getElementById('open-help')?.addEventListener('click', handleOpenHelp);
  
  // Add hover effects
  addHoverEffects();
  
  console.log('✅ Popup event listeners set up');
}

// Add hover effects to buttons
function addHoverEffects(): void {
  const buttons = document.querySelectorAll('.action-btn, .debug-btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      (button as HTMLElement).style.opacity = '0.8';
    });
    
    button.addEventListener('mouseleave', () => {
      (button as HTMLElement).style.opacity = '1';
    });
  });
}

// Load current state
async function loadCurrentState(): Promise<void> {
  try {
    console.log('📊 Loading current state...');
    
    // Get state from background script
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATE' });
    
    if (response.state) {
      updateUIWithState(response.state);
    } else {
      updateStatusInfo('Failed to load state');
    }
    
    console.log('✅ State loaded');
  } catch (error) {
    console.error('❌ Failed to load state:', error);
    updateStatusInfo('Error loading state');
  }
}

// Update UI with state
function updateUIWithState(state: any): void {
  try {
    // Update premium status
    const premiumStatus = document.getElementById('premium-status');
    if (premiumStatus) {
      if (state.user?.isPremium) {
        premiumStatus.textContent = 'Premium';
        premiumStatus.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        premiumStatus.style.color = 'white';
      } else {
        premiumStatus.textContent = 'Free';
        premiumStatus.style.background = '#f0f0f0';
        premiumStatus.style.color = '#666';
      }
    }
    
    // Update status info
    const statusInfo = document.getElementById('status-info');
    if (statusInfo) {
      const isLoggedIn = state.user?.isLoggedIn ? 'Yes' : 'No';
      const conversationCount = state.conversations?.conversations?.length || 0;
      const folderCount = state.conversations?.folders?.length || 0;
      
      statusInfo.innerHTML = `
        <div><strong>Logged In:</strong> ${isLoggedIn}</div>
        <div><strong>Conversations:</strong> ${conversationCount}</div>
        <div><strong>Folders:</strong> ${folderCount}</div>
        <div><strong>Theme:</strong> ${state.user?.preferences?.theme || 'auto'}</div>
      `;
    }
    
    console.log('✅ UI updated with state');
  } catch (error) {
    console.error('❌ Failed to update UI with state:', error);
  }
}

// Update status info
function updateStatusInfo(message: string): void {
  const statusInfo = document.getElementById('status-info');
  if (statusInfo) {
    statusInfo.textContent = message;
  }
}

// Event handlers
async function handleEnablePremium(): Promise<void> {
  try {
    console.log('💎 Enabling premium features...');
    updateStatusInfo('Enabling premium features...');
    
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await chrome.tabs.sendMessage(tab.id, { type: 'ENABLE_PREMIUM' });
    }
    
    // Update local state
    await stateManager.updateUser({ isPremium: true });
    
    // Reload state
    await loadCurrentState();
    
    updateStatusInfo('Premium features enabled!');
    console.log('✅ Premium features enabled');
  } catch (error) {
    console.error('❌ Failed to enable premium features:', error);
    updateStatusInfo('Failed to enable premium features');
  }
}

async function handleUpdatePlanText(): Promise<void> {
  try {
    console.log('🔄 Updating plan text...');
    updateStatusInfo('Updating plan text...');
    
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await chrome.tabs.sendMessage(tab.id, { type: 'UPDATE_PLAN_TEXT' });
    }
    
    updateStatusInfo('Plan text updated!');
    console.log('✅ Plan text updated');
  } catch (error) {
    console.error('❌ Failed to update plan text:', error);
    updateStatusInfo('Failed to update plan text');
  }
}

async function handleRefreshConversations(): Promise<void> {
  try {
    console.log('📚 Refreshing conversations...');
    updateStatusInfo('Refreshing conversations...');
    
    // Send API request to get conversations
    const response = await chrome.runtime.sendMessage({
      type: 'API_REQUEST',
      payload: { method: 'GET_CONVERSATIONS' }
    });
    
    if (response) {
      await stateManager.updateConversations({ conversations: response });
      await loadCurrentState();
      updateStatusInfo('Conversations refreshed!');
    }
    
    console.log('✅ Conversations refreshed');
  } catch (error) {
    console.error('❌ Failed to refresh conversations:', error);
    updateStatusInfo('Failed to refresh conversations');
  }
}

async function handleGetState(): Promise<void> {
  try {
    console.log('📊 Getting state...');
    
    const state = stateManager.getState();
    console.log('Current state:', state);
    
    updateStatusInfo('State logged to console');
  } catch (error) {
    console.error('❌ Failed to get state:', error);
    updateStatusInfo('Failed to get state');
  }
}

async function handleClearStorage(): Promise<void> {
  try {
    console.log('🗑️ Clearing storage...');
    updateStatusInfo('Clearing storage...');
    
    await storageUtils.clear();
    await stateManager.resetState();
    
    updateStatusInfo('Storage cleared!');
    console.log('✅ Storage cleared');
  } catch (error) {
    console.error('❌ Failed to clear storage:', error);
    updateStatusInfo('Failed to clear storage');
  }
}

function handleOpenSettings(): void {
  console.log('⚙️ Opening settings...');
  chrome.tabs.create({ url: chrome.runtime.getURL('manage.html') });
}

function handleOpenHelp(): void {
  console.log('❓ Opening help...');
  chrome.tabs.create({ url: 'https://github.com/DonQuilatte/ext#readme' });
}

console.log('🎯 Popup script loaded and ready');
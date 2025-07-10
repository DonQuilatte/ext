import { stateManager } from '@shared/state';
import { storageUtils } from '@shared/utils';

console.log('🎯 Ishka Extension Manage Page Initialized');

// Initialize manage page when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🚀 Initializing manage page...');
    
    // Initialize manage page UI
    await initializeManagePageUI();
    
    // Set up event listeners
    setupManagePageEventListeners();
    
    // Load current state
    await loadCurrentState();
    
    console.log('✅ Manage page initialization complete');
  } catch (error) {
    console.error('❌ Manage page initialization failed:', error);
  }
});

// Initialize manage page UI
async function initializeManagePageUI(): Promise<void> {
  try {
    console.log('🎨 Setting up manage page UI...');
    
    // Create main container
    const container = document.createElement('div');
    container.id = 'ishka-manage-container';
    container.className = 'ishka-manage';
    container.style.cssText = `
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
      min-height: 100vh;
    `;
    
    // Add header
    const header = createManageHeader();
    container.appendChild(header);
    
    // Add navigation
    const navigation = createNavigation();
    container.appendChild(navigation);
    
    // Add content sections
    const content = createManageContent();
    container.appendChild(content);
    
    // Replace existing content
    document.body.innerHTML = '';
    document.body.appendChild(container);
    
    console.log('✅ Manage page UI created');
  } catch (error) {
    console.error('❌ Failed to create manage page UI:', error);
  }
}

// Create manage page header
function createManageHeader(): HTMLElement {
  const header = document.createElement('div');
  header.className = 'manage-header';
  header.style.cssText = `
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 2px solid #e5e5e5;
  `;
  
  header.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;"></div>
        <div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #333;">Ishka Settings</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">Manage your extension preferences</p>
        </div>
      </div>
      <div id="premium-status-large" style="font-size: 14px; padding: 8px 16px; border-radius: 20px; background: #f0f0f0; color: #666;">
        Free Plan
      </div>
    </div>
  `;
  
  return header;
}

// Create navigation
function createNavigation(): HTMLElement {
  const navigation = document.createElement('div');
  navigation.className = 'manage-navigation';
  navigation.style.cssText = `
    margin-bottom: 24px;
  `;
  
  navigation.innerHTML = `
    <div style="display: flex; gap: 8px; border-bottom: 1px solid #e5e5e5;">
      <button id="nav-general" class="nav-btn active" style="
        padding: 12px 20px;
        border: none;
        background: #10a37f;
        color: white;
        border-radius: 6px 6px 0 0;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">General</button>
      <button id="nav-premium" class="nav-btn" style="
        padding: 12px 20px;
        border: none;
        background: #f0f0f0;
        color: #666;
        border-radius: 6px 6px 0 0;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">Premium</button>
      <button id="nav-advanced" class="nav-btn" style="
        padding: 12px 20px;
        border: none;
        background: #f0f0f0;
        color: #666;
        border-radius: 6px 6px 0 0;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">Advanced</button>
      <button id="nav-about" class="nav-btn" style="
        padding: 12px 20px;
        border: none;
        background: #f0f0f0;
        color: #666;
        border-radius: 6px 6px 0 0;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">About</button>
    </div>
  `;
  
  return navigation;
}

// Create manage content
function createManageContent(): HTMLElement {
  const content = document.createElement('div');
  content.className = 'manage-content';
  
  // Create content sections
  const generalSection = createGeneralSection();
  const premiumSection = createPremiumSection();
  const advancedSection = createAdvancedSection();
  const aboutSection = createAboutSection();
  
  // Hide all sections except general initially
  premiumSection.style.display = 'none';
  advancedSection.style.display = 'none';
  aboutSection.style.display = 'none';
  
  content.appendChild(generalSection);
  content.appendChild(premiumSection);
  content.appendChild(advancedSection);
  content.appendChild(aboutSection);
  
  return content;
}

// Create general settings section
function createGeneralSection(): HTMLElement {
  const section = document.createElement('div');
  section.id = 'general-section';
  section.className = 'content-section';
  
  section.innerHTML = `
    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #333;">General Settings</h2>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Theme</label>
      <select id="theme-select" style="
        width: 200px;
        padding: 8px 12px;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        font-size: 14px;
      ">
        <option value="auto">Auto</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Language</label>
      <select id="language-select" style="
        width: 200px;
        padding: 8px 12px;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        font-size: 14px;
      ">
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="it">Italiano</option>
        <option value="pt">Português</option>
        <option value="ru">Русский</option>
        <option value="zh">中文</option>
      </select>
    </div>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; color: #333;">
        <input type="checkbox" id="notifications-toggle" style="width: 16px; height: 16px;">
        Enable Notifications
      </label>
    </div>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; color: #333;">
        <input type="checkbox" id="auto-save-toggle" style="width: 16px; height: 16px;">
        Auto-save Conversations
      </label>
    </div>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Auto-save Interval (seconds)</label>
      <input type="number" id="auto-save-interval" min="10" max="300" value="30" style="
        width: 200px;
        padding: 8px 12px;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        font-size: 14px;
      ">
    </div>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Maximum Conversations</label>
      <input type="number" id="max-conversations" min="10" max="1000" value="100" style="
        width: 200px;
        padding: 8px 12px;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        font-size: 14px;
      ">
    </div>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; color: #333;">
        <input type="checkbox" id="rtl-toggle" style="width: 16px; height: 16px;">
        Enable RTL Support
      </label>
    </div>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; color: #333;">
        <input type="checkbox" id="voice-download-toggle" style="width: 16px; height: 16px;">
        Enable Voice Download
      </label>
    </div>
    
    <div style="margin-top: 32px;">
      <button id="save-general" style="
        padding: 12px 24px;
        background: #10a37f;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-right: 12px;
      ">Save Settings</button>
      <button id="reset-general" style="
        padding: 12px 24px;
        background: #f0f0f0;
        color: #666;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">Reset to Defaults</button>
    </div>
  `;
  
  return section;
}

// Create premium settings section
function createPremiumSection(): HTMLElement {
  const section = document.createElement('div');
  section.id = 'premium-section';
  section.className = 'content-section';
  
  section.innerHTML = `
    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #333;">Premium Features</h2>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 20px;">Upgrade to Premium</h3>
      <p style="margin: 0 0 16px 0; opacity: 0.9;">Unlock advanced features and enhance your ChatGPT experience</p>
      <button id="upgrade-premium" style="
        padding: 12px 24px;
        background: white;
        color: #667eea;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      ">Upgrade Now</button>
    </div>
    
    <div class="feature-list" style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #333;">Premium Features</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 12px; background: #f8f9fa; border-radius: 6px;">
          <span style="color: #10a37f; font-weight: bold;">✓</span>
          Advanced Prompt Library
        </li>
        <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 12px; background: #f8f9fa; border-radius: 6px;">
          <span style="color: #10a37f; font-weight: bold;">✓</span>
          Unlimited Conversation Export
        </li>
        <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 12px; background: #f8f9fa; border-radius: 6px;">
          <span style="color: #10a37f; font-weight: bold;">✓</span>
          Voice Download (MP3)
        </li>
        <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 12px; background: #f8f9fa; border-radius: 6px;">
          <span style="color: #10a37f; font-weight: bold;">✓</span>
          Advanced Search & Filtering
        </li>
        <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 12px; background: #f8f9fa; border-radius: 6px;">
          <span style="color: #10a37f; font-weight: bold;">✓</span>
          Priority Support
        </li>
      </ul>
    </div>
    
    <div style="margin-top: 32px;">
      <button id="enable-premium-dev" style="
        padding: 12px 24px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-right: 12px;
      ">Enable Premium (Dev)</button>
      <button id="disable-premium-dev" style="
        padding: 12px 24px;
        background: #f0f0f0;
        color: #666;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">Disable Premium (Dev)</button>
    </div>
  `;
  
  return section;
}

// Create advanced settings section
function createAdvancedSection(): HTMLElement {
  const section = document.createElement('div');
  section.id = 'advanced-section';
  section.className = 'content-section';
  
  section.innerHTML = `
    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #333;">Advanced Settings</h2>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; color: #333;">
        <input type="checkbox" id="debug-mode-toggle" style="width: 16px; height: 16px;">
        Debug Mode
      </label>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Enable detailed logging for troubleshooting</p>
    </div>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; color: #333;">
        <input type="checkbox" id="logging-toggle" style="width: 16px; height: 16px;">
        Enable Logging
      </label>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Log extension activities for analysis</p>
    </div>
    
    <div class="setting-group" style="margin-bottom: 24px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Custom API Endpoint</label>
      <input type="text" id="custom-api-endpoint" placeholder="https://api.example.com" style="
        width: 100%;
        max-width: 400px;
        padding: 8px 12px;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        font-size: 14px;
      ">
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Leave empty to use default ChatGPT API</p>
    </div>
    
    <div style="margin-top: 32px;">
      <button id="export-settings" style="
        padding: 12px 24px;
        background: #10a37f;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-right: 12px;
      ">Export Settings</button>
      <button id="import-settings" style="
        padding: 12px 24px;
        background: #f0f0f0;
        color: #666;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-right: 12px;
      ">Import Settings</button>
      <button id="reset-all" style="
        padding: 12px 24px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">Reset All Settings</button>
    </div>
  `;
  
  return section;
}

// Create about section
function createAboutSection(): HTMLElement {
  const section = document.createElement('div');
  section.id = 'about-section';
  section.className = 'content-section';
  
  section.innerHTML = `
    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #333;">About Ishka</h2>
    
    <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333;">Version Information</h3>
      <div id="version-info" style="font-size: 14px; color: #666; line-height: 1.6;">
        Loading...
      </div>
    </div>
    
    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333;">Features</h3>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
        <li>Enhanced ChatGPT interface</li>
        <li>Conversation management and organization</li>
        <li>Prompt library and templates</li>
        <li>Export conversations in multiple formats</li>
        <li>Voice download capabilities</li>
        <li>Advanced search and filtering</li>
        <li>RTL language support</li>
        <li>Custom themes and preferences</li>
      </ul>
    </div>
    
    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333;">Support</h3>
      <p style="margin: 0 0 12px 0; line-height: 1.6;">
        Need help? Check out our documentation or contact support.
      </p>
      <div style="display: flex; gap: 12px;">
        <a href="https://github.com/DonQuilatte/ext#readme" target="_blank" style="
          padding: 8px 16px;
          background: #10a37f;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 14px;
        ">Documentation</a>
        <a href="https://github.com/DonQuilatte/ext/issues" target="_blank" style="
          padding: 8px 16px;
          background: #f0f0f0;
          color: #666;
          text-decoration: none;
          border-radius: 6px;
          font-size: 14px;
        ">Report Issue</a>
      </div>
    </div>
    
    <div style="margin-top: 32px;">
      <button id="check-updates" style="
        padding: 12px 24px;
        background: #10a37f;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">Check for Updates</button>
    </div>
  `;
  
  return section;
}

// Set up manage page event listeners
function setupManagePageEventListeners(): void {
  console.log('🎧 Setting up manage page event listeners...');
  
  // Navigation
  document.getElementById('nav-general')?.addEventListener('click', () => showSection('general'));
  document.getElementById('nav-premium')?.addEventListener('click', () => showSection('premium'));
  document.getElementById('nav-advanced')?.addEventListener('click', () => showSection('advanced'));
  document.getElementById('nav-about')?.addEventListener('click', () => showSection('about'));
  
  // General settings
  document.getElementById('save-general')?.addEventListener('click', handleSaveGeneral);
  document.getElementById('reset-general')?.addEventListener('click', handleResetGeneral);
  
  // Premium settings
  document.getElementById('upgrade-premium')?.addEventListener('click', handleUpgradePremium);
  document.getElementById('enable-premium-dev')?.addEventListener('click', handleEnablePremiumDev);
  document.getElementById('disable-premium-dev')?.addEventListener('click', handleDisablePremiumDev);
  
  // Advanced settings
  document.getElementById('export-settings')?.addEventListener('click', handleExportSettings);
  document.getElementById('import-settings')?.addEventListener('click', handleImportSettings);
  document.getElementById('reset-all')?.addEventListener('click', handleResetAll);
  
  // About
  document.getElementById('check-updates')?.addEventListener('click', handleCheckUpdates);
  
  console.log('✅ Manage page event listeners set up');
}

// Show specific section
function showSection(sectionName: string): void {
  // Hide all sections
  const sections = ['general', 'premium', 'advanced', 'about'];
  sections.forEach(name => {
    const section = document.getElementById(`${name}-section`);
    if (section) section.style.display = 'none';
  });
  
  // Show target section
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) targetSection.style.display = 'block';
  
  // Update navigation
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.classList.remove('active');
    (btn as HTMLElement).style.background = '#f0f0f0';
    (btn as HTMLElement).style.color = '#666';
  });
  
  const activeButton = document.getElementById(`nav-${sectionName}`);
  if (activeButton) {
    activeButton.classList.add('active');
    (activeButton as HTMLElement).style.background = '#10a37f';
    (activeButton as HTMLElement).style.color = 'white';
  }
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
      console.error('Failed to load state');
    }
    
    console.log('✅ State loaded');
  } catch (error) {
    console.error('❌ Failed to load state:', error);
  }
}

// Update UI with state
function updateUIWithState(state: any): void {
  try {
    // Update premium status
    const premiumStatus = document.getElementById('premium-status-large');
    if (premiumStatus) {
      if (state.user?.isPremium) {
        premiumStatus.textContent = 'Premium Plan';
        premiumStatus.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        premiumStatus.style.color = 'white';
      } else {
        premiumStatus.textContent = 'Free Plan';
        premiumStatus.style.background = '#f0f0f0';
        premiumStatus.style.color = '#666';
      }
    }
    
    // Update general settings
    const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
    if (themeSelect) themeSelect.value = state.user?.preferences?.theme || 'auto';
    
    const languageSelect = document.getElementById('language-select') as HTMLSelectElement;
    if (languageSelect) languageSelect.value = state.user?.preferences?.language || 'en';
    
    const notificationsToggle = document.getElementById('notifications-toggle') as HTMLInputElement;
    if (notificationsToggle) notificationsToggle.checked = state.user?.preferences?.enableNotifications || false;
    
    const autoSaveToggle = document.getElementById('auto-save-toggle') as HTMLInputElement;
    if (autoSaveToggle) autoSaveToggle.checked = state.user?.preferences?.autoSave || false;
    
    const autoSaveInterval = document.getElementById('auto-save-interval') as HTMLInputElement;
    if (autoSaveInterval) autoSaveInterval.value = state.settings?.general?.autoSaveInterval?.toString() || '30';
    
    const maxConversations = document.getElementById('max-conversations') as HTMLInputElement;
    if (maxConversations) maxConversations.value = state.settings?.general?.maxConversations?.toString() || '100';
    
    const rtlToggle = document.getElementById('rtl-toggle') as HTMLInputElement;
    if (rtlToggle) rtlToggle.checked = state.settings?.general?.enableRTL || false;
    
    const voiceDownloadToggle = document.getElementById('voice-download-toggle') as HTMLInputElement;
    if (voiceDownloadToggle) voiceDownloadToggle.checked = state.settings?.general?.enableVoiceDownload || false;
    
    // Update advanced settings
    const debugModeToggle = document.getElementById('debug-mode-toggle') as HTMLInputElement;
    if (debugModeToggle) debugModeToggle.checked = state.settings?.advanced?.debugMode || false;
    
    const loggingToggle = document.getElementById('logging-toggle') as HTMLInputElement;
    if (loggingToggle) loggingToggle.checked = state.settings?.advanced?.enableLogging || false;
    
    const customApiEndpoint = document.getElementById('custom-api-endpoint') as HTMLInputElement;
    if (customApiEndpoint) customApiEndpoint.value = state.settings?.advanced?.customApiEndpoint || '';
    
    // Update version info
    const versionInfo = document.getElementById('version-info');
    if (versionInfo) {
      versionInfo.innerHTML = `
        <div><strong>Extension Version:</strong> 3.9.7</div>
        <div><strong>Manifest Version:</strong> 3</div>
        <div><strong>Chrome Version:</strong> ${navigator.userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown'}</div>
        <div><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</div>
      `;
    }
    
    console.log('✅ UI updated with state');
  } catch (error) {
    console.error('❌ Failed to update UI with state:', error);
  }
}

// Event handlers
async function handleSaveGeneral(): Promise<void> {
  try {
    console.log('💾 Saving general settings...');
    
    const settings = {
      user: {
        preferences: {
          theme: (document.getElementById('theme-select') as HTMLSelectElement)?.value || 'auto',
          language: (document.getElementById('language-select') as HTMLSelectElement)?.value || 'en',
          enableNotifications: (document.getElementById('notifications-toggle') as HTMLInputElement)?.checked || false,
          autoSave: (document.getElementById('auto-save-toggle') as HTMLInputElement)?.checked || false,
        },
      },
      settings: {
        general: {
          autoSaveInterval: parseInt((document.getElementById('auto-save-interval') as HTMLInputElement)?.value || '30'),
          maxConversations: parseInt((document.getElementById('max-conversations') as HTMLInputElement)?.value || '100'),
          enableRTL: (document.getElementById('rtl-toggle') as HTMLInputElement)?.checked || false,
          enableVoiceDownload: (document.getElementById('voice-download-toggle') as HTMLInputElement)?.checked || false,
        },
      },
    };
    
    await stateManager.setState(settings);
    alert('Settings saved successfully!');
    
    console.log('✅ General settings saved');
  } catch (error) {
    console.error('❌ Failed to save general settings:', error);
    alert('Failed to save settings');
  }
}

async function handleResetGeneral(): Promise<void> {
  try {
    console.log('🔄 Resetting general settings...');
    
    if (confirm('Are you sure you want to reset all general settings to defaults?')) {
      await stateManager.updateUser({
        preferences: {
          theme: 'auto',
          language: 'en',
          enableNotifications: true,
          autoSave: true,
        },
      });
      
      await stateManager.updateSettings({
        general: {
          autoSaveInterval: 30000,
          maxConversations: 100,
          enableRTL: false,
          enableVoiceDownload: false,
        },
      });
      
      await loadCurrentState();
      alert('General settings reset to defaults!');
    }
    
    console.log('✅ General settings reset');
  } catch (error) {
    console.error('❌ Failed to reset general settings:', error);
    alert('Failed to reset settings');
  }
}

function handleUpgradePremium(): void {
  console.log('💎 Opening premium upgrade...');
  chrome.tabs.create({ url: 'https://github.com/DonQuilatte/ext#readme' });
}

async function handleEnablePremiumDev(): Promise<void> {
  try {
    console.log('💎 Enabling premium features (dev)...');
    
    await stateManager.updateUser({ isPremium: true });
    await storageUtils.set('DEV_MODE_PREMIUM', true);
    await storageUtils.set('MOCK_PREMIUM', true);
    
    await loadCurrentState();
    alert('Premium features enabled (dev mode)!');
    
    console.log('✅ Premium features enabled (dev)');
  } catch (error) {
    console.error('❌ Failed to enable premium features:', error);
    alert('Failed to enable premium features');
  }
}

async function handleDisablePremiumDev(): Promise<void> {
  try {
    console.log('🔒 Disabling premium features (dev)...');
    
    await stateManager.updateUser({ isPremium: false });
    await storageUtils.remove('DEV_MODE_PREMIUM');
    await storageUtils.remove('MOCK_PREMIUM');
    
    await loadCurrentState();
    alert('Premium features disabled (dev mode)!');
    
    console.log('✅ Premium features disabled (dev)');
  } catch (error) {
    console.error('❌ Failed to disable premium features:', error);
    alert('Failed to disable premium features');
  }
}

async function handleExportSettings(): Promise<void> {
  try {
    console.log('📤 Exporting settings...');
    
    const state = stateManager.getState();
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ishka-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    console.log('✅ Settings exported');
  } catch (error) {
    console.error('❌ Failed to export settings:', error);
    alert('Failed to export settings');
  }
}

function handleImportSettings(): void {
  console.log('📥 Importing settings...');
  
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (event) => {
    try {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const settings = JSON.parse(text);
        
        await stateManager.setState(settings);
        await loadCurrentState();
        
        alert('Settings imported successfully!');
        console.log('✅ Settings imported');
      }
    } catch (error) {
      console.error('❌ Failed to import settings:', error);
      alert('Failed to import settings');
    }
  };
  input.click();
}

async function handleResetAll(): Promise<void> {
  try {
    console.log('🔄 Resetting all settings...');
    
    if (confirm('Are you sure you want to reset ALL settings? This cannot be undone.')) {
      await stateManager.resetState();
      await loadCurrentState();
      alert('All settings reset to defaults!');
    }
    
    console.log('✅ All settings reset');
  } catch (error) {
    console.error('❌ Failed to reset all settings:', error);
    alert('Failed to reset settings');
  }
}

function handleCheckUpdates(): void {
  console.log('🔄 Checking for updates...');
  alert('You are using the latest version (3.9.7)');
}

console.log('🎯 Manage page script loaded and ready');
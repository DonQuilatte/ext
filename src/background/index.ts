import { stateManager } from '@shared/state';
import { apiClient } from '@shared/api';
import { storageUtils } from '@shared/utils';

console.log('🚀 Ishka Extension Background Script Initialized');

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Set up initial state
    await stateManager.resetState();
    console.log('✅ Initial state set up');
  }
  
  if (details.reason === 'update') {
    // Handle updates
    console.log('🔄 Extension updated, checking for data migration...');
    await handleUpdate();
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(async () => {
  console.log('🔄 Extension starting up...');
  await initializeExtension();
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Received message:', message);
  
  handleMessage(message, sender)
    .then(sendResponse)
    .catch((error) => {
      console.error('❌ Error handling message:', error);
      sendResponse({ error: error.message });
    });
  
  return true; // Keep message channel open for async response
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('chatgpt.com')) {
    console.log('📄 ChatGPT page loaded, injecting content script');
    injectContentScript(tabId);
  }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('💾 Storage changed:', changes, namespace);
  
  // Update state manager with storage changes
  Object.entries(changes).forEach(([key, change]) => {
    if (change.newValue !== undefined) {
      stateManager.setState({ [key]: change.newValue });
    }
  });
});

// Message handler
async function handleMessage(message: any, sender: chrome.runtime.MessageSender): Promise<any> {
  const { type, payload } = message;
  
  switch (type) {
    case 'GET_STATE':
      return { state: stateManager.getState() };
      
    case 'SET_STATE':
      await stateManager.setState(payload);
      return { success: true };
      
    case 'API_REQUEST':
      return await handleAPIRequest(payload);
      
    case 'GET_STORAGE':
      return await storageUtils.get(payload.key);
      
    case 'SET_STORAGE':
      await storageUtils.set(payload.key, payload.value);
      return { success: true };
      
    case 'CLEAR_STORAGE':
      await storageUtils.clear();
      return { success: true };
      
    case 'GET_EXTENSION_INFO':
      return {
        version: chrome.runtime.getManifest().version,
        name: chrome.runtime.getManifest().name,
        id: chrome.runtime.id,
      };
      
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}

// API request handler
async function handleAPIRequest(payload: any): Promise<any> {
  const { method, endpoint, data } = payload;
  
  try {
    switch (method) {
      case 'GET_CONVERSATIONS':
        return await apiClient.getConversations();
        
      case 'GET_CONVERSATION':
        return await apiClient.getConversation(data.id);
        
      case 'CREATE_CONVERSATION':
        return await apiClient.createConversation(data.title);
        
      case 'UPDATE_CONVERSATION':
        return await apiClient.updateConversation(data.id, data.updates);
        
      case 'DELETE_CONVERSATION':
        await apiClient.deleteConversation(data.id);
        return { success: true };
        
      case 'GET_FOLDERS':
        return await apiClient.getFolders();
        
      case 'CREATE_FOLDER':
        return await apiClient.createFolder(data.name, data.color);
        
      case 'UPDATE_FOLDER':
        return await apiClient.updateFolder(data.id, data.updates);
        
      case 'DELETE_FOLDER':
        await apiClient.deleteFolder(data.id);
        return { success: true };
        
      case 'GET_PROMPTS':
        return await apiClient.getPrompts();
        
      case 'CREATE_PROMPT':
        return await apiClient.createPrompt(data.prompt);
        
      case 'UPDATE_PROMPT':
        return await apiClient.updatePrompt(data.id, data.updates);
        
      case 'DELETE_PROMPT':
        await apiClient.deletePrompt(data.id);
        return { success: true };
        
      default:
        throw new Error(`Unknown API method: ${method}`);
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Inject content script into tab
async function injectContentScript(tabId: number): Promise<void> {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js'],
    });
    console.log('✅ Content script injected');
  } catch (error) {
    console.error('❌ Failed to inject content script:', error);
  }
}

// Initialize extension
async function initializeExtension(): Promise<void> {
  try {
    // Load initial data
    const conversations = await apiClient.getConversations();
    const folders = await apiClient.getFolders();
    const prompts = await apiClient.getPrompts();
    
    // Update state
    await stateManager.setState({
      conversations: {
        conversations,
        folders,
        isLoading: false,
      },
    });
    
    console.log('✅ Extension initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize extension:', error);
  }
}

// Handle extension updates
async function handleUpdate(): Promise<void> {
  try {
    // Check for data migration needs
    const currentVersion = chrome.runtime.getManifest().version;
    const storedVersion = await storageUtils.get<string>('extension_version');
    
    if (storedVersion !== currentVersion) {
      console.log(`🔄 Migrating from ${storedVersion} to ${currentVersion}`);
      
      // Perform any necessary data migrations here
      
      // Update stored version
      await storageUtils.set('extension_version', currentVersion);
      console.log('✅ Migration completed');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Set up periodic tasks
setInterval(async () => {
  try {
    // Auto-save conversations if enabled
    const state = stateManager.getState();
    if (state.user.preferences.autoSave) {
      const conversations = await apiClient.getConversations();
      await stateManager.updateConversations({ conversations });
    }
  } catch (error) {
    console.error('❌ Periodic task failed:', error);
  }
}, 30000); // Every 30 seconds

console.log('✅ Background script setup complete');
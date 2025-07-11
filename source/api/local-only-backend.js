// Local-Only Backend for Free Extension
// All features enabled locally without external dependencies

class LocalOnlyBackend {
  constructor() {
    this.isEnabled = false;
    this.requestLog = [];
    this.originalFetch = null;
    this.storage = {
      folders: [],
      prompts: [],
      chains: [],
      settings: {},
      userData: {
        id: 'local-user',
        isPremium: true, // Always true for local mode
        subscriptionStatus: 'active',
        features: ['all'] // All features enabled
      }
    };
  }

  async init() {
    try {
      console.log('🏠 LOCAL-ONLY BACKEND: Initializing completely free, local-only mode');
      console.log('🔍 DEBUG: Chrome storage available =', !!chrome?.storage);
      console.log('🔍 DEBUG: Window properties before init:', {
        isResetChatHistory: typeof window.isResetChatHistory,
        local_folders: typeof window.local_folders,
        conversations: typeof window.conversations,
        timestamp: new Date().toISOString()
      });
      
      // Initialize local storage with default data
      await this.initializeLocalStorage();
      
      // Always enable local-only mode
      this.enable();
      
      console.log('✅ LOCAL-ONLY BACKEND: All features enabled locally');
      console.log('🔍 DEBUG: Window properties after init:', {
        isResetChatHistory: typeof window.isResetChatHistory,
        local_folders: typeof window.local_folders,
        conversations: typeof window.conversations,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ LOCAL-ONLY BACKEND: Initialization error:', error);
      console.log('🔍 DEBUG: Error details:', {
        message: error.message,
        stack: error.stack,
        chromeStorage: !!chrome?.storage,
        timestamp: new Date().toISOString()
      });
    }
  }

  async initializeLocalStorage() {
    try {
      console.log('🔧 LOCAL-ONLY BACKEND: Starting storage initialization...');
      
      // Use robust storage utilities if available
      const storageKeys = ['local_folders', 'local_prompts', 'local_chains', 'local_user_data', 'local_settings'];
      const defaultData = {
        local_folders: [],
        local_prompts: [],
        local_chains: [],
        local_user_data: null,
        local_settings: {}
      };
      
      let existingData;
      if (window.storageUtils && window.storageUtils.isAvailable()) {
        console.log('🔧 LOCAL-ONLY BACKEND: Using robust storage utilities');
        existingData = await window.storageUtils.safeGet(storageKeys, defaultData);
      } else {
        console.log('🔧 LOCAL-ONLY BACKEND: Using direct Chrome storage access');
        if (window.chrome && window.chrome.storage && window.chrome.storage.local) {
          existingData = await chrome.storage.local.get(storageKeys);
          // Merge with defaults
          existingData = { ...defaultData, ...existingData };
        } else {
          console.warn('⚠️ LOCAL-ONLY BACKEND: Chrome storage not available, using defaults');
          existingData = defaultData;
        }
      }
      
      console.log('🔍 DEBUG: Retrieved storage data:', {
        hasLocalFolders: !!existingData.local_folders,
        hasLocalPrompts: !!existingData.local_prompts,
        hasLocalChains: !!existingData.local_chains,
        hasUserData: !!existingData.local_user_data,
        hasSettings: !!existingData.local_settings,
        timestamp: new Date().toISOString()
      });

      // Initialize folders with safe storage
      this.storage.folders = existingData.local_folders || [];
      if (!existingData.local_folders) {
        if (window.storageUtils) {
          await window.storageUtils.safeSet({ local_folders: this.storage.folders });
        } else if (window.chrome?.storage?.local) {
          await chrome.storage.local.set({ local_folders: this.storage.folders });
        }
      }

      // Initialize prompts with safe storage
      this.storage.prompts = existingData.local_prompts || [];
      if (!existingData.local_prompts) {
        if (window.storageUtils) {
          await window.storageUtils.safeSet({ local_prompts: this.storage.prompts });
        } else if (window.chrome?.storage?.local) {
          await chrome.storage.local.set({ local_prompts: this.storage.prompts });
        }
      }

      // Initialize chains with safe storage
      this.storage.chains = existingData.local_chains || [];
      if (!existingData.local_chains) {
        if (window.storageUtils) {
          await window.storageUtils.safeSet({ local_chains: this.storage.chains });
        } else if (window.chrome?.storage?.local) {
          await chrome.storage.local.set({ local_chains: this.storage.chains });
        }
      }

      // Initialize user data (always premium)
      const userData = {
        id: 'local-user',
        isPremium: true,
        isPaid: true,
        subscriptionStatus: 'active',
        subscriptionType: 'premium',
        planType: 'premium',
        features: ['folders', 'prompts', 'chains', 'export', 'search', 'media'],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      // Save user data with safe storage
      if (window.storageUtils) {
        await window.storageUtils.safeSet({ local_user_data: userData });
      } else if (window.chrome?.storage?.local) {
        await chrome.storage.local.set({ local_user_data: userData });
      }
      this.storage.userData = userData;

      // Initialize settings with safe storage
      if (!existingData.local_settings) {
        this.storage.settings = {
          theme: 'auto',
          language: 'en',
          features: {
            allEnabled: true,
            premiumFeaturesEnabled: true
          }
        };
        if (window.storageUtils) {
          await window.storageUtils.safeSet({ local_settings: this.storage.settings });
        } else if (window.chrome?.storage?.local) {
          await chrome.storage.local.set({ local_settings: this.storage.settings });
        }
      } else {
        this.storage.settings = existingData.local_settings;
      }

      console.log('🔧 LOCAL-ONLY BACKEND: Local storage initialized');
    } catch (error) {
      console.error('❌ LOCAL-ONLY BACKEND: Storage initialization error:', error);
    }
  }

  enable() {
    if (this.isEnabled) return;
    
    this.isEnabled = true;
    this.originalFetch = window.fetch;
    
    // Override fetch globally to intercept external API calls
    window.fetch = this.localFetch.bind(this);
    
    console.log('🔄 LOCAL-ONLY BACKEND: All API calls redirected to local storage');
  }

  disable() {
    if (!this.isEnabled) return;
    
    this.isEnabled = false;
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
      this.originalFetch = null;
    }
    
    console.log('🔄 LOCAL-ONLY BACKEND: Disabled');
  }

  async localFetch(url, options = {}) {
    const originalUrl = url;
    
    // Log the request for debugging
    this.requestLog.push({
      url: originalUrl,
      method: options.method || 'GET',
      timestamp: new Date().toISOString(),
      redirected: true
    });

    // Handle all external API calls locally
    if (this.shouldInterceptRequest(url)) {
      return this.handleLocalRequest(url, options);
    }

    // For non-intercepted requests, use original fetch
    return this.originalFetch.call(window, url, options);
  }

  shouldInterceptRequest(url) {
    const interceptPatterns = [
      'api.infi-dev.com',
      '/payments/',
      '/auth/',
      '/user/',
      '/subscription/',
      '/folder/',
      '/prompt/',
      '/chain/',
      '/premium/'
    ];

    return interceptPatterns.some(pattern => url.includes(pattern));
  }

  async handleLocalRequest(url, options) {
    const method = options.method || 'GET';
    let mockData = null;
    let status = 200;

    try {
      // Authentication endpoints - always return success
      if (url.includes('/auth/')) {
        mockData = {
          valid: true,
          success: true,
          jwt: 'local-jwt-token',
          user: this.storage.userData,
          token: 'local-auth-token'
        };
      }
      
      // Payment/subscription endpoints - always return premium
      else if (url.includes('/payments/') || url.includes('/subscription/')) {
        mockData = {
          valid: true,
          isPremiumUser: true,
          isPaid: true,
          subscriptionStatus: 'active',
          subscriptionType: 'premium',
          planType: 'premium',
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          features: ['all'],
          limits: null // No limits
        };
      }
      
      // Folder management endpoints
      else if (url.includes('/folder/')) {
        mockData = await this.handleFolderRequest(url, method, options);
      }
      
      // Prompt management endpoints
      else if (url.includes('/prompt/')) {
        mockData = await this.handlePromptRequest(url, method, options);
      }
      
      // Chain management endpoints
      else if (url.includes('/chain/')) {
        mockData = await this.handleChainRequest(url, method, options);
      }
      
      // User management endpoints
      else if (url.includes('/user/')) {
        mockData = {
          success: true,
          user: this.storage.userData
        };
      }
      
      // Default success response
      else {
        mockData = {
          success: true,
          message: 'Local-only mode: Request handled locally'
        };
      }

      // Create mock response
      const response = new Response(JSON.stringify(mockData), {
        status: status,
        statusText: status === 200 ? 'OK' : 'Error',
        headers: {
          'Content-Type': 'application/json',
          'X-Local-Only-Backend': 'true'
        }
      });

      console.log(`🔄 LOCAL-ONLY BACKEND: ${method} ${url} -> Local response`);
      return response;

    } catch (error) {
      console.error('❌ LOCAL-ONLY BACKEND: Error handling request:', error);
      
      const errorResponse = new Response(JSON.stringify({
        success: false,
        error: error.message,
        localMode: true
      }), {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          'Content-Type': 'application/json',
          'X-Local-Only-Backend': 'true'
        }
      });

      return errorResponse;
    }
  }

  async handleFolderRequest(url, method, options) {
    const body = options.body ? JSON.parse(options.body) : null;

    if (url.includes('/get-all') || url.includes('/get')) {
      return {
        success: true,
        folders: this.storage.folders
      };
    } else if (url.includes('/create') && method === 'POST') {
      const newFolder = {
        id: Date.now().toString(),
        name: body.name || 'New Folder',
        description: body.description || '',
        created: new Date().toISOString(),
        ...body
      };
      
      this.storage.folders.push(newFolder);
      await chrome.storage.local.set({ local_folders: this.storage.folders });
      
      return {
        success: true,
        folder: newFolder
      };
    } else if (url.includes('/update') && method === 'PUT') {
      const folderId = this.extractIdFromUrl(url);
      const folderIndex = this.storage.folders.findIndex(f => f.id === folderId);
      
      if (folderIndex !== -1) {
        this.storage.folders[folderIndex] = { ...this.storage.folders[folderIndex], ...body };
        await chrome.storage.local.set({ local_folders: this.storage.folders });
        
        return {
          success: true,
          folder: this.storage.folders[folderIndex]
        };
      }
    } else if (url.includes('/delete') && method === 'DELETE') {
      const folderId = this.extractIdFromUrl(url);
      this.storage.folders = this.storage.folders.filter(f => f.id !== folderId);
      await chrome.storage.local.set({ local_folders: this.storage.folders });
      
      return { success: true };
    }

    return { success: true, folders: this.storage.folders };
  }

  async handlePromptRequest(url, method, options) {
    const body = options.body ? JSON.parse(options.body) : null;

    if (url.includes('/get-all') || url.includes('/get')) {
      return {
        success: true,
        prompts: this.storage.prompts
      };
    } else if (url.includes('/create') && method === 'POST') {
      const newPrompt = {
        id: Date.now().toString(),
        name: body.name || 'New Prompt',
        content: body.content || '',
        category: body.category || 'general',
        created: new Date().toISOString(),
        ...body
      };
      
      this.storage.prompts.push(newPrompt);
      await chrome.storage.local.set({ local_prompts: this.storage.prompts });
      
      return {
        success: true,
        prompt: newPrompt
      };
    } else if (url.includes('/update') && method === 'PUT') {
      const promptId = this.extractIdFromUrl(url);
      const promptIndex = this.storage.prompts.findIndex(p => p.id === promptId);
      
      if (promptIndex !== -1) {
        this.storage.prompts[promptIndex] = { ...this.storage.prompts[promptIndex], ...body };
        await chrome.storage.local.set({ local_prompts: this.storage.prompts });
        
        return {
          success: true,
          prompt: this.storage.prompts[promptIndex]
        };
      }
    } else if (url.includes('/delete') && method === 'DELETE') {
      const promptId = this.extractIdFromUrl(url);
      this.storage.prompts = this.storage.prompts.filter(p => p.id !== promptId);
      await chrome.storage.local.set({ local_prompts: this.storage.prompts });
      
      return { success: true };
    }

    return { success: true, prompts: this.storage.prompts };
  }

  async handleChainRequest(url, method, options) {
    const body = options.body ? JSON.parse(options.body) : null;

    if (url.includes('/get-all') || url.includes('/get')) {
      return {
        success: true,
        chains: this.storage.chains
      };
    } else if (url.includes('/create') && method === 'POST') {
      const newChain = {
        id: Date.now().toString(),
        name: body.name || 'New Chain',
        prompts: body.prompts || [],
        created: new Date().toISOString(),
        ...body
      };
      
      this.storage.chains.push(newChain);
      await chrome.storage.local.set({ local_chains: this.storage.chains });
      
      return {
        success: true,
        chain: newChain
      };
    } else if (url.includes('/update') && method === 'PUT') {
      const chainId = this.extractIdFromUrl(url);
      const chainIndex = this.storage.chains.findIndex(c => c.id === chainId);
      
      if (chainIndex !== -1) {
        this.storage.chains[chainIndex] = { ...this.storage.chains[chainIndex], ...body };
        await chrome.storage.local.set({ local_chains: this.storage.chains });
        
        return {
          success: true,
          chain: this.storage.chains[chainIndex]
        };
      }
    } else if (url.includes('/delete') && method === 'DELETE') {
      const chainId = this.extractIdFromUrl(url);
      this.storage.chains = this.storage.chains.filter(c => c.id !== chainId);
      await chrome.storage.local.set({ local_chains: this.storage.chains });
      
      return { success: true };
    }

    return { success: true, chains: this.storage.chains };
  }

  extractIdFromUrl(url) {
    const matches = url.match(/\/([^\/]+)$/);
    return matches ? matches[1] : null;
  }

  getRequestLog() {
    return this.requestLog;
  }

  clearRequestLog() {
    this.requestLog = [];
  }

  getStorageStats() {
    return {
      folders: this.storage.folders.length,
      prompts: this.storage.prompts.length,
      chains: this.storage.chains.length,
      userData: this.storage.userData,
      settings: this.storage.settings
    };
  }
}

// Initialize and export
const localOnlyBackend = new LocalOnlyBackend();

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => localOnlyBackend.init());
} else {
  localOnlyBackend.init();
}

// Make available globally for debugging
window.localOnlyBackend = localOnlyBackend;

console.log('🏠 LOCAL-ONLY BACKEND: System loaded - All features free and local');
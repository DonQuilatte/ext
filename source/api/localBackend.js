// Local Backend Service - Replaces all external API calls
// This service provides offline functionality for the ChatGPT extension

class LocalBackend {
  constructor() {
    this.baseURL = 'https://api.infi-dev.com/example-removed/';
    this.isLocalMode = true;
    this.initializeLocalStorage();
  }

  // Initialize local storage with default data
  async initializeLocalStorage() {
    const defaults = {
      'local_folders': [],
      'local_prompts': [],
      'local_chains': [],
      'local_pinned': [],
      'local_announcements': [],
      'local_user_data': { isPaid: true, accountId: 'local-user' }
    };

    for (const [key, value] of Object.entries(defaults)) {
      try {
        const existing = await chrome.storage.local.get(key);
        // Handle case where existing is undefined or doesn't contain the key
        if (!existing || existing[key] === undefined || existing[key] === null) {
          await chrome.storage.local.set({ [key]: value });
        }
      } catch (error) {
        console.warn(`🚨 LOCAL BACKEND: Failed to initialize storage for ${key}:`, error);
        // Set default value even if storage access fails
        try {
          await chrome.storage.local.set({ [key]: value });
        } catch (setError) {
          console.error(`🚨 LOCAL BACKEND: Critical storage error for ${key}:`, setError);
        }
      }
    }
  }

  // Helper method to intercept and redirect API calls
  async interceptApiCall(url, options = {}) {
    console.log(`🔄 LOCAL BACKEND: Intercepting API call to ${url}`);
    
    // Parse the URL to determine endpoint
    const urlObj = new URL(url);
    const path = urlObj.pathname.replace('/example-removed/', '');
    const searchParams = urlObj.searchParams;
    
    // Route to appropriate local handler
    return await this.routeRequest(path, options, searchParams);
  }

  // Route requests to local handlers
  async routeRequest(path, options, searchParams) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;

    try {
      // Authentication endpoints
      if (path.startsWith('auth/')) {
        return await this.handleAuth(path, method, body);
      }
      
      // Payment endpoints
      if (path.startsWith('payments/')) {
        return await this.handlePayments(path, method, body);
      }
      
      // Folder endpoints
      if (path.startsWith('folder/')) {
        return await this.handleFolders(path, method, body, searchParams);
      }
      
      // Prompt endpoints
      if (path.startsWith('prompt/') || path.startsWith('prompts-library')) {
        return await this.handlePrompts(path, method, body, searchParams);
      }
      
      // Chain endpoints
      if (path.startsWith('chains/')) {
        return await this.handleChains(path, method, body);
      }
      
      // Pinned endpoints
      if (path.startsWith('pinned/')) {
        return await this.handlePinned(path, method, body);
      }
      
      // Announcement endpoints
      if (path.startsWith('announcements')) {
        return await this.handleAnnouncements(path, method, body);
      }
      
      // Default response for unknown endpoints
      return { success: true, data: null, message: 'Local backend response' };
      
    } catch (error) {
      console.error('🚨 LOCAL BACKEND: Error handling request:', error);
      return { success: false, error: error.message };
    }
  }

  // Authentication handlers
  async handleAuth(path, method, body) {
    if (path === 'auth/generate-jwt') {
      return {
        success: true,
        token: 'local-jwt-token-' + Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
    }
    
    if (path === 'auth/jwks') {
      return {
        success: true,
        jwks: { keys: [] } // Empty JWKS for local mode
      };
    }
    
    return { success: true, data: null };
  }

  // Payment validation handler
  async handlePayments(path, method, body) {
    if (path === 'payments/valid/extension') {
      // Check if dev mode is enabled
      const devMode = await chrome.storage.local.get('DEV_MODE_PREMIUM');
      return {
        valid: devMode.DEV_MODE_PREMIUM === true
      };
    }
    
    return { valid: false };
  }

  // Folder management handlers
  async handleFolders(path, method, body, searchParams) {
    const folders = await this.getLocalData('local_folders');
    
    switch (path) {
      case 'folder/get-all':
        return { success: true, data: folders };
        
      case 'folder/get':
        const folderId = searchParams.get('folderId');
        const folder = folders.find(f => f.id === folderId);
        return { success: true, data: folder };
        
      case 'folder/get-by-id':
        const id = searchParams.get('folderId');
        const folderById = folders.find(f => f.id === id);
        return { success: true, data: folderById };
        
      case 'folder/create':
        if (method === 'POST' && body) {
          const newFolder = {
            ...body,
            id: 'folder-' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          folders.push(newFolder);
          await this.setLocalData('local_folders', folders);
          return { success: true, data: newFolder };
        }
        break;
        
      case 'folder/update':
        if (method === 'PUT' && body) {
          const index = folders.findIndex(f => f.id === body.id);
          if (index !== -1) {
            folders[index] = { ...folders[index], ...body, updatedAt: new Date().toISOString() };
            await this.setLocalData('local_folders', folders);
            return { success: true, data: folders[index] };
          }
        }
        break;
        
      case 'folder/delete':
        if (method === 'DELETE' && body) {
          const filteredFolders = folders.filter(f => f.id !== body.id);
          await this.setLocalData('local_folders', filteredFolders);
          return { success: true, data: { deleted: true } };
        }
        break;
        
      case 'folder/pinned':
        const pinnedFolders = folders.filter(f => f.isPinned);
        return { success: true, data: pinnedFolders };
    }
    
    return { success: true, data: [] };
  }

  // Prompt management handlers
  async handlePrompts(path, method, body, searchParams) {
    const prompts = await this.getLocalData('local_prompts');
    
    if (path === 'prompts-library') {
      // Return default prompt library
      const defaultPrompts = [
        {
          id: 'default-1',
          title: 'Code Review',
          content: 'Please review this code and provide feedback:',
          category: 'Development'
        },
        {
          id: 'default-2',
          title: 'Grammar Check',
          content: 'Please check the grammar and spelling of the following text:',
          category: 'Writing'
        },
        {
          id: 'default-3',
          title: 'Explain Code',
          content: 'Please explain what this code does in simple terms:',
          category: 'Development'
        }
      ];
      return { success: true, data: [...defaultPrompts, ...prompts] };
    }
    
    switch (path) {
      case 'prompt/get':
        return { success: true, data: prompts };
        
      case 'prompt/create':
        if (method === 'POST' && body) {
          const newPrompt = {
            ...body,
            id: 'prompt-' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          prompts.push(newPrompt);
          await this.setLocalData('local_prompts', prompts);
          return { success: true, data: newPrompt };
        }
        break;
        
      case 'prompt/update':
        if (method === 'PUT' && body) {
          const index = prompts.findIndex(p => p.id === body.id);
          if (index !== -1) {
            prompts[index] = { ...prompts[index], ...body, updatedAt: new Date().toISOString() };
            await this.setLocalData('local_prompts', prompts);
            return { success: true, data: prompts[index] };
          }
        }
        break;
        
      case 'prompt/delete':
        if (method === 'DELETE' && body) {
          const filteredPrompts = prompts.filter(p => p.id !== body.id);
          await this.setLocalData('local_prompts', filteredPrompts);
          return { success: true, data: { deleted: true } };
        }
        break;
    }
    
    return { success: true, data: [] };
  }

  // Chain management handlers
  async handleChains(path, method, body) {
    const chains = await this.getLocalData('local_chains');
    
    switch (path) {
      case 'chains/get':
        return { success: true, data: chains };
        
      case 'chains/create':
        if (method === 'POST' && body) {
          const newChain = {
            ...body,
            id: 'chain-' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          chains.push(newChain);
          await this.setLocalData('local_chains', chains);
          return { success: true, data: newChain };
        }
        break;
        
      case 'chains/update':
        if (method === 'PUT' && body) {
          const index = chains.findIndex(c => c.id === body.id);
          if (index !== -1) {
            chains[index] = { ...chains[index], ...body, updatedAt: new Date().toISOString() };
            await this.setLocalData('local_chains', chains);
            return { success: true, data: chains[index] };
          }
        }
        break;
        
      case 'chains/delete':
        if (method === 'DELETE' && body) {
          const filteredChains = chains.filter(c => c.id !== body.id);
          await this.setLocalData('local_chains', filteredChains);
          return { success: true, data: { deleted: true } };
        }
        break;
    }
    
    return { success: true, data: [] };
  }

  // Pinned items handlers
  async handlePinned(path, method, body) {
    const pinned = await this.getLocalData('local_pinned');
    
    switch (path) {
      case 'pinned/get':
        return { success: true, data: pinned };
        
      case 'pinned/pin':
        if (method === 'POST' && body) {
          const newPinned = {
            ...body,
            id: 'pinned-' + Date.now(),
            pinnedAt: new Date().toISOString()
          };
          pinned.push(newPinned);
          await this.setLocalData('local_pinned', pinned);
          return { success: true, data: newPinned };
        }
        break;
        
      case 'pinned/unpin':
        if (method === 'DELETE' && body) {
          const filteredPinned = pinned.filter(p => p.id !== body.id);
          await this.setLocalData('local_pinned', filteredPinned);
          return { success: true, data: { deleted: true } };
        }
        break;
    }
    
    return { success: true, data: [] };
  }

  // Announcement handlers
  async handleAnnouncements(path, method, body) {
    const announcements = await this.getLocalData('local_announcements');
    
    // Return default local announcements
    const defaultAnnouncements = [
      {
        id: 'local-1',
        title: 'Local Mode Active',
        content: 'You are running in local development mode. All data is stored locally.',
        type: 'info',
        date: new Date().toISOString(),
        isRead: false
      }
    ];
    
    return { success: true, data: [...defaultAnnouncements, ...announcements] };
  }

  // Helper methods for local storage
  async getLocalData(key) {
    try {
      const result = await chrome.storage.local.get(key);
      return (result && result[key]) ? result[key] : [];
    } catch (error) {
      console.warn(`🚨 LOCAL BACKEND: Failed to get data for ${key}:`, error);
      return [];
    }
  }

  async setLocalData(key, data) {
    await chrome.storage.local.set({ [key]: data });
  }

  // Method to replace original fetch calls
  async localFetch(url, options = {}) {
    if (url.includes('api.infi-dev.com/example-removed/')) {
      console.log(`🔄 LOCAL BACKEND: Redirecting ${url} to local handler`);
      return {
        ok: true,
        json: async () => await this.interceptApiCall(url, options),
        text: async () => JSON.stringify(await this.interceptApiCall(url, options))
      };
    }
    
    // For non-API calls, use original fetch
    return fetch(url, options);
  }
}

// Initialize local backend
const localBackend = new LocalBackend();

// Override global fetch for API interception
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string' && url.includes('api.infi-dev.com/example-removed/')) {
    return localBackend.localFetch(url, options);
  }
  return originalFetch.apply(this, arguments);
};

// Export for other modules
if (typeof window !== 'undefined') {
  window.localBackend = localBackend;
}

console.log('🏠 LOCAL BACKEND: Local backend service initialized');
console.log('🔄 All API calls to api.infi-dev.com/example-removed/ will be handled locally');
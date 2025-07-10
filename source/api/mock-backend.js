// Mock Backend for Development Mode
// Intercepts and mocks all external API calls

class MockBackend {
  constructor() {
    this.isEnabled = false;
    this.requestLog = [];
    this.originalFetch = null;
    this.config = null;
    this.mockResponses = null;
  }

  async init() {
    try {
      // Local-only mode configuration - ALWAYS ENABLED
      this.config = {
        OFFLINE_MODE: true,
        MOCK_PREMIUM: true,
        DISABLE_KEY_VALIDATION: true,
        DEBUG_REQUESTS: true
      };
      this.mockResponses = {
        AUTH: { generateJWT: { jwt: "mock.jwt.token", success: true } },
        PAYMENTS: { valid: true, premium: true }
      };

      // Always enable in local-only mode
      this.enable();
    } catch (error) {
      console.log('[MockBackend] Initialization error:', error);
    }
  }

  enable() {
    if (this.isEnabled) return;
    
    this.isEnabled = true;
    this.originalFetch = window.fetch;
    
    // Override fetch globally
    window.fetch = this.mockFetch.bind(this);
    
    console.log('[MockBackend] Enabled - All external requests will be mocked');
  }

  disable() {
    if (!this.isEnabled) return;
    
    this.isEnabled = false;
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
    }
    
    console.log('[MockBackend] Disabled - External requests restored');
  }

  async mockFetch(url, options = {}) {
    const urlString = url.toString();
    
    // Log the request if debugging is enabled
    if (this.config.DEBUG_REQUESTS) {
      this.logRequest(urlString, options);
    }

    // Check if this is an external API call that should be mocked
    if (this.shouldMockRequest(urlString)) {
      return this.getMockResponse(urlString, options);
    }

    // For non-external requests, use original fetch
    return this.originalFetch(url, options);
  }

  shouldMockRequest(url) {
    // ONLY mock ai-toolbox specific API calls
    // DO NOT mock OpenAI ChatGPT APIs to preserve ChatGPT functionality
    const mockOnlyDomains = [
      'api.infi-dev.com'  // Only mock the extension's backend API
    ];

    // Specific ai-toolbox endpoints to mock
    const aiToolboxEndpoints = [
      '/ai-toolbox/',
      '/auth/generate-jwt',
      '/payments/valid',
      '/api/payments/validate',
      '/api/auth/validate',
      '/user/cancel-deletion',
      '/auth/jwks'
    ];

    // Check if URL contains ai-toolbox specific endpoints
    const isAiToolboxEndpoint = aiToolboxEndpoints.some(endpoint => url.includes(endpoint));
    
    // Check if URL is from domains we want to mock
    const isMockDomain = mockOnlyDomains.some(domain => url.includes(domain));

    // IMPORTANT: Do NOT mock OpenAI ChatGPT APIs
    const isOpenAIAPI = url.includes('chatgpt.com') ||
                       url.includes('oaistatic.com') ||
                       url.includes('openai.com/api') ||
                       url.includes('cdn.oaistatic.com');

    // Only mock if it's an ai-toolbox endpoint or mock domain, but NOT OpenAI APIs
    return (isAiToolboxEndpoint || isMockDomain) && !isOpenAIAPI;
  }

  async getMockResponse(url, options) {
    console.log(`[MockBackend] Intercepting request to: ${url}`);

    // Determine response based on URL
    let mockData = null;
    let status = 200;

    if (url.includes('/auth/generate-jwt')) {
      mockData = this.mockResponses.AUTH.generateJWT;
    } else if (url.includes('/payments/valid')) {
      mockData = this.mockResponses.PAYMENTS;
    } else if (url.includes('/api/payments/validate')) {
      mockData = {
        valid: true,
        isPremiumUser: true,
        subscriptionStatus: 'active',
        subscriptionType: 'premium',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };
    } else if (url.includes('/api/auth/validate')) {
      mockData = {
        valid: true,
        user: { id: 'dev-user', premium: true },
        token: 'mock-jwt-token'
      };
    } else if (url.includes('/user/cancel-deletion')) {
      mockData = { success: true };
    } else if (url.includes('/auth/jwks')) {
      mockData = {
        keys: [{
          kty: "RSA",
          kid: "mock-key",
          use: "sig",
          alg: "RS256",
          n: "mock-modulus",
          e: "AQAB"
        }]
      };
    }
    // PREMIUM FEATURES API ENDPOINTS
    else if (url.includes('/ai-toolbox/folder/get-all')) {
      mockData = this.getMockFolders();
    } else if (url.includes('/ai-toolbox/folder/get')) {
      mockData = this.getMockFolders();
    } else if (url.includes('/ai-toolbox/folder/get-by-id')) {
      mockData = this.getMockFolder();
    } else if (url.includes('/ai-toolbox/folder/get-subfolders')) {
      mockData = this.getMockSubfolders();
    } else if (url.includes('/ai-toolbox/folder/create')) {
      mockData = { success: true, folder: this.getMockFolder() };
    } else if (url.includes('/ai-toolbox/folder/update')) {
      mockData = this.getMockSubfolders();
    } else if (url.includes('/ai-toolbox/folder/delete')) {
      mockData = { children: [] };
    } else if (url.includes('/ai-toolbox/folder/pinned')) {
      mockData = this.getMockPinnedFolders();
    } else if (url.includes('/ai-toolbox/conversation/')) {
      mockData = this.getMockConversations();
    } else if (url.includes('/ai-toolbox/prompt/')) {
      mockData = this.getMockPrompts();
    } else if (url.includes('/ai-toolbox/chain/')) {
      mockData = this.getMockChains();
    } else {
      // Default mock response
      mockData = {
        success: true,
        message: "Mocked response",
        timestamp: Date.now()
      };
    }

    // Create mock Response object
    const response = new Response(JSON.stringify(mockData), {
      status: status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: {
        'Content-Type': 'application/json',
        'X-Mocked-Response': 'true'
      }
    });

    // Add delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 100));

    return response;
  }

  logRequest(url, options) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      url: url,
      method: options.method || 'GET',
      headers: options.headers || {},
      mocked: this.shouldMockRequest(url)
    };

    this.requestLog.push(logEntry);
    console.log('[MockBackend] Request:', logEntry);

    // Keep only last 100 requests
    if (this.requestLog.length > 100) {
      this.requestLog = this.requestLog.slice(-100);
    }
  }

  getRequestLog() {
    return this.requestLog;
  }

  clearLog() {
    this.requestLog = [];
  }

  // Mock data generators for premium features
  getMockFolders() {
    return [
      {
        _id: "folder1",
        name: "Work Projects",
        parentFolder: null,
        chatIds: ["chat1", "chat2"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: "folder2",
        name: "Personal",
        parentFolder: null,
        chatIds: ["chat3"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  getMockFolder() {
    return {
      _id: "folder1",
      name: "Work Projects",
      parentFolder: null,
      chatIds: ["chat1", "chat2"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  getMockSubfolders() {
    return {
      parentFolder: {
        _id: "folder1",
        name: "Work Projects"
      },
      children: [
        {
          _id: "subfolder1",
          name: "Development",
          parentFolder: "folder1",
          chatIds: ["chat4", "chat5"]
        }
      ]
    };
  }

  getMockPinnedFolders() {
    return [
      {
        _id: "folder1",
        name: "Work Projects",
        pinned: true
      }
    ];
  }

  getMockConversations() {
    return [
      {
        id: "chat1",
        title: "Mock Conversation 1",
        create_time: Date.now() / 1000,
        update_time: Date.now() / 1000,
        mapping: {},
        current_node: null
      },
      {
        id: "chat2",
        title: "Mock Conversation 2",
        create_time: Date.now() / 1000,
        update_time: Date.now() / 1000,
        mapping: {},
        current_node: null
      }
    ];
  }

  getMockPrompts() {
    return [
      {
        _id: "prompt1",
        name: "Mock Prompt 1",
        content: "This is a mock prompt for testing",
        category: "general",
        createdAt: new Date().toISOString()
      },
      {
        _id: "prompt2",
        name: "Mock Prompt 2",
        content: "Another mock prompt for development",
        category: "development",
        createdAt: new Date().toISOString()
      }
    ];
  }

  getMockChains() {
    return [
      {
        _id: "chain1",
        name: "Mock Chain 1",
        prompts: ["prompt1", "prompt2"],
        createdAt: new Date().toISOString()
      }
    ];
  }
}

// Create global instance
const mockBackend = new MockBackend();

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mockBackend.init());
  } else {
    mockBackend.init();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MockBackend, mockBackend };
} else if (typeof window !== 'undefined') {
  window.mockBackend = mockBackend;
}
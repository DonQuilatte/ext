import type { ExtensionState, DeepPartial } from '../types';

export class StateManager {
  private state: ExtensionState;
  private listeners: Map<string, Set<(state: ExtensionState) => void>>;
  private storage: chrome.storage.LocalStorageArea | null;

  constructor(initialState: ExtensionState) {
    this.state = initialState;
    this.listeners = new Map();
    this.storage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage.local : null;
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    if (!this.storage) {
      console.warn('Chrome storage API not available');
      return;
    }

    try {
      const stored = await this.storage.get(null);
      if (stored && Object.keys(stored).length > 0) {
        this.state = { ...this.state, ...stored };
      }
    } catch (error) {
      console.warn('Failed to load state from storage:', error);
    }
  }

  getState(): ExtensionState {
    return { ...this.state };
  }

  async setState(partial: DeepPartial<ExtensionState>): Promise<void> {
    const previousState = { ...this.state };
    this.state = this.mergeState(this.state, partial);

    // Save to storage
    if (this.storage) {
      try {
        await this.storage.set(partial);
      } catch (error) {
        console.error('Failed to save state to storage:', error);
      }
    }

    // Notify listeners
    this.notifyListeners(previousState, this.state);
  }

  private mergeState(current: ExtensionState, partial: DeepPartial<ExtensionState>): ExtensionState {
    const merged = { ...current };
    
    for (const [key, value] of Object.entries(partial)) {
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          merged[key as keyof ExtensionState] = this.mergeState(
            current[key as keyof ExtensionState] as any,
            value as any
          ) as any;
        } else {
          merged[key as keyof ExtensionState] = value as any;
        }
      }
    }
    
    return merged;
  }

  subscribe(key: string, callback: (state: ExtensionState) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(callback);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  private notifyListeners(previousState: ExtensionState, currentState: ExtensionState): void {
    // Notify all listeners
    for (const [key, listeners] of this.listeners) {
      if (this.hasStateChanged(key, previousState, currentState)) {
        listeners.forEach(callback => {
          try {
            callback(currentState);
          } catch (error) {
            console.error(`Error in state listener for key "${key}":`, error);
          }
        });
      }
    }
  }

  private hasStateChanged(key: string, previous: ExtensionState, current: ExtensionState): boolean {
    const previousValue = this.getNestedValue(previous, key);
    const currentValue = this.getNestedValue(current, key);
    return JSON.stringify(previousValue) !== JSON.stringify(currentValue);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Convenience methods for specific state updates
  async updateUser(userUpdates: DeepPartial<ExtensionState['user']>): Promise<void> {
    await this.setState({ user: userUpdates });
  }

  async updateConversations(conversationUpdates: DeepPartial<ExtensionState['conversations']>): Promise<void> {
    await this.setState({ conversations: conversationUpdates });
  }

  async updateUI(uiUpdates: DeepPartial<ExtensionState['ui']>): Promise<void> {
    await this.setState({ ui: uiUpdates });
  }

  async updateSettings(settingsUpdates: DeepPartial<ExtensionState['settings']>): Promise<void> {
    await this.setState({ settings: settingsUpdates });
  }

  // Utility methods
  async resetState(): Promise<void> {
    const initialState = this.getInitialState();
    await this.setState(initialState);
  }

  async clearStorage(): Promise<void> {
    if (this.storage) {
      try {
        await this.storage.clear();
      } catch (error) {
        console.error('Failed to clear storage:', error);
      }
    }
  }

  private getInitialState(): ExtensionState {
    return {
      user: {
        isPremium: false,
        isLoggedIn: false,
        preferences: {
          theme: 'auto',
          language: 'en',
          enableNotifications: true,
          autoSave: true,
        },
      },
      conversations: {
        conversations: [],
        folders: [],
        searchQuery: '',
        isLoading: false,
      },
      ui: {
        isModalOpen: false,
        snackbar: {
          isVisible: false,
          message: '',
          type: 'info',
        },
        sidebar: {
          isOpen: false,
          activeTab: 'conversations',
        },
        loading: {
          isLoading: false,
        },
      },
      settings: {
        general: {
          autoSaveInterval: 30000,
          maxConversations: 100,
          enableRTL: false,
          enableVoiceDownload: false,
        },
        premium: {
          isEnabled: false,
          features: [],
        },
        advanced: {
          debugMode: false,
          enableLogging: false,
        },
      },
    };
  }
}

// Global state instance
export const stateManager = new StateManager({
  user: {
    isPremium: false,
    isLoggedIn: false,
    preferences: {
      theme: 'auto',
      language: 'en',
      enableNotifications: true,
      autoSave: true,
    },
  },
  conversations: {
    conversations: [],
    folders: [],
    searchQuery: '',
    isLoading: false,
  },
  ui: {
    isModalOpen: false,
    snackbar: {
      isVisible: false,
      message: '',
      type: 'info',
    },
    sidebar: {
      isOpen: false,
      activeTab: 'conversations',
    },
    loading: {
      isLoading: false,
    },
  },
  settings: {
    general: {
      autoSaveInterval: 30000,
      maxConversations: 100,
      enableRTL: false,
      enableVoiceDownload: false,
    },
    premium: {
      isEnabled: false,
      features: [],
    },
    advanced: {
      debugMode: false,
      enableLogging: false,
    },
  },
});

// Export convenience functions
export const getState = () => stateManager.getState();
export const setState = (partial: DeepPartial<ExtensionState>) => stateManager.setState(partial);
export const subscribe = (key: string, callback: (state: ExtensionState) => void) => 
  stateManager.subscribe(key, callback);
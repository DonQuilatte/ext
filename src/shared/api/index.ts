import type { APIClient, Conversation, Folder, Prompt } from '../types';

export class ChatGPTAPIClient implements APIClient {
  private baseUrl = 'https://chatgpt.com';
  private isAuthenticated = false;

  constructor() {
    this.checkAuthentication();
  }

  private async checkAuthentication(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/session`);
      this.isAuthenticated = response.ok;
    } catch (error) {
      console.warn('Failed to check authentication:', error);
      this.isAuthenticated = false;
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const data = await this.makeRequest<{ items: any[] }>('/api/conversations');
      return data.items.map(this.mapConversationFromAPI);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      return [];
    }
  }

  async getConversation(id: string): Promise<Conversation> {
    const data = await this.makeRequest<any>(`/api/conversations/${id}`);
    return this.mapConversationFromAPI(data);
  }

  async createConversation(title: string): Promise<Conversation> {
    const data = await this.makeRequest<any>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return this.mapConversationFromAPI(data);
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const data = await this.makeRequest<any>(`/api/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return this.mapConversationFromAPI(data);
  }

  async deleteConversation(id: string): Promise<void> {
    await this.makeRequest(`/api/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  async getFolders(): Promise<Folder[]> {
    try {
      const data = await this.makeRequest<{ items: any[] }>('/api/folders');
      return data.items.map(this.mapFolderFromAPI);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
      return [];
    }
  }

  async createFolder(name: string, color?: string): Promise<Folder> {
    const data = await this.makeRequest<any>('/api/folders', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
    return this.mapFolderFromAPI(data);
  }

  async updateFolder(id: string, updates: Partial<Folder>): Promise<Folder> {
    const data = await this.makeRequest<any>(`/api/folders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return this.mapFolderFromAPI(data);
  }

  async deleteFolder(id: string): Promise<void> {
    await this.makeRequest(`/api/folders/${id}`, {
      method: 'DELETE',
    });
  }

  async getPrompts(): Promise<Prompt[]> {
    try {
      const data = await this.makeRequest<{ items: any[] }>('/api/prompts');
      return data.items.map(this.mapPromptFromAPI);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      return [];
    }
  }

  async createPrompt(prompt: Omit<Prompt, 'id'>): Promise<Prompt> {
    const data = await this.makeRequest<any>('/api/prompts', {
      method: 'POST',
      body: JSON.stringify(prompt),
    });
    return this.mapPromptFromAPI(data);
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
    const data = await this.makeRequest<any>(`/api/prompts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return this.mapPromptFromAPI(data);
  }

  async deletePrompt(id: string): Promise<void> {
    await this.makeRequest(`/api/prompts/${id}`, {
      method: 'DELETE',
    });
  }

  // Mapping functions to convert API responses to our types
  private mapConversationFromAPI(data: any): Conversation {
    return {
      id: data.id,
      title: data.title || 'Untitled',
      messages: data.messages?.map(this.mapMessageFromAPI) || [],
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: new Date(data.updated_at || Date.now()),
      folderId: data.folder_id,
      isPinned: data.is_pinned || false,
      tags: data.tags || [],
    };
  }

  private mapMessageFromAPI(data: any): any {
    return {
      id: data.id,
      role: data.role,
      content: data.content,
      timestamp: new Date(data.timestamp || Date.now()),
      model: data.model,
    };
  }

  private mapFolderFromAPI(data: any): Folder {
    return {
      id: data.id,
      name: data.name,
      color: data.color,
      conversationIds: data.conversation_ids || [],
      createdAt: new Date(data.created_at || Date.now()),
    };
  }

  private mapPromptFromAPI(data: any): Prompt {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category || 'general',
      tags: data.tags || [],
      isFavorite: data.is_favorite || false,
      usageCount: data.usage_count || 0,
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: new Date(data.updated_at || Date.now()),
    };
  }
}

// Export singleton instance
export const apiClient = new ChatGPTAPIClient();
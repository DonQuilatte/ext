import type { APIClient, Conversation, Folder, Prompt } from '../types';
export declare class ChatGPTAPIClient implements APIClient {
    private baseUrl;
    private isAuthenticated;
    constructor();
    private checkAuthentication;
    private makeRequest;
    getConversations(): Promise<Conversation[]>;
    getConversation(id: string): Promise<Conversation>;
    createConversation(title: string): Promise<Conversation>;
    updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation>;
    deleteConversation(id: string): Promise<void>;
    getFolders(): Promise<Folder[]>;
    createFolder(name: string, color?: string): Promise<Folder>;
    updateFolder(id: string, updates: Partial<Folder>): Promise<Folder>;
    deleteFolder(id: string): Promise<void>;
    getPrompts(): Promise<Prompt[]>;
    createPrompt(prompt: Omit<Prompt, 'id'>): Promise<Prompt>;
    updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt>;
    deletePrompt(id: string): Promise<void>;
    private mapConversationFromAPI;
    private mapMessageFromAPI;
    private mapFolderFromAPI;
    private mapPromptFromAPI;
}
export declare const apiClient: ChatGPTAPIClient;
//# sourceMappingURL=index.d.ts.map
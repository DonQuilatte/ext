export interface ExtensionState {
    user: UserState;
    conversations: ConversationState;
    ui: UIState;
    settings: SettingsState;
}
export interface UserState {
    isPremium: boolean;
    isLoggedIn: boolean;
    userId?: string;
    preferences: UserPreferences;
}
export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    enableNotifications: boolean;
    autoSave: boolean;
}
export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    folderId?: string;
    isPinned: boolean;
    tags: string[];
}
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    model?: string;
}
export interface ConversationState {
    conversations: Conversation[];
    currentConversationId?: string;
    folders: Folder[];
    searchQuery: string;
    isLoading: boolean;
    error?: string;
}
export interface Folder {
    id: string;
    name: string;
    color?: string;
    conversationIds: string[];
    createdAt: Date;
}
export interface UIState {
    isModalOpen: boolean;
    modalType?: ModalType;
    snackbar: SnackbarState;
    sidebar: SidebarState;
    loading: LoadingState;
}
export type ModalType = 'prompt-library' | 'export-conversation' | 'settings' | 'folder-create' | 'folder-edit';
export interface SnackbarState {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}
export interface SidebarState {
    isOpen: boolean;
    activeTab: 'conversations' | 'prompts' | 'settings';
}
export interface LoadingState {
    isLoading: boolean;
    message?: string;
    progress?: number;
}
export interface SettingsState {
    general: GeneralSettings;
    premium: PremiumSettings;
    advanced: AdvancedSettings;
}
export interface GeneralSettings {
    autoSaveInterval: number;
    maxConversations: number;
    enableRTL: boolean;
    enableVoiceDownload: boolean;
}
export interface PremiumSettings {
    isEnabled: boolean;
    features: PremiumFeature[];
}
export interface PremiumFeature {
    id: string;
    name: string;
    isEnabled: boolean;
    description: string;
}
export interface AdvancedSettings {
    debugMode: boolean;
    enableLogging: boolean;
    customApiEndpoint?: string;
}
export interface APIClient {
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
}
export interface Prompt {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    isFavorite: boolean;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface StorageData {
    conversations: Conversation[];
    folders: Folder[];
    prompts: Prompt[];
    settings: SettingsState;
    user: UserState;
}
export interface ExtensionEvent {
    type: string;
    payload: any;
    timestamp: Date;
}
export interface ExtensionError {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
}
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
//# sourceMappingURL=index.d.ts.map
import type { ExtensionState, DeepPartial } from '../types';
export declare class StateManager {
    private state;
    private listeners;
    private storage;
    constructor(initialState: ExtensionState);
    private initializeStorage;
    getState(): ExtensionState;
    setState(partial: DeepPartial<ExtensionState>): Promise<void>;
    private mergeState;
    subscribe(key: string, callback: (state: ExtensionState) => void): () => void;
    private notifyListeners;
    private hasStateChanged;
    private getNestedValue;
    updateUser(userUpdates: DeepPartial<ExtensionState['user']>): Promise<void>;
    updateConversations(conversationUpdates: DeepPartial<ExtensionState['conversations']>): Promise<void>;
    updateUI(uiUpdates: DeepPartial<ExtensionState['ui']>): Promise<void>;
    updateSettings(settingsUpdates: DeepPartial<ExtensionState['settings']>): Promise<void>;
    resetState(): Promise<void>;
    clearStorage(): Promise<void>;
    private getInitialState;
}
export declare const stateManager: StateManager;
export declare const getState: () => ExtensionState;
export declare const setState: (partial: DeepPartial<ExtensionState>) => Promise<void>;
export declare const subscribe: (key: string, callback: (state: ExtensionState) => void) => () => void;
//# sourceMappingURL=index.d.ts.map
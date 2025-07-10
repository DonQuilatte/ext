declare namespace chrome {
  namespace runtime {
    interface InstallDetails {
      reason: 'install' | 'update' | 'chrome_update' | 'shared_module_update';
      previousVersion?: string;
      id?: string;
    }

    interface MessageSender {
      tab?: tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }

    const onInstalled: {
      addListener(callback: (details: InstallDetails) => void): void;
    };

    const onStartup: {
      addListener(callback: () => void): void;
    };

    const onMessage: {
      addListener(
        callback: (
          message: any,
          sender: MessageSender,
          sendResponse: (response?: any) => void
        ) => boolean | void
      ): void;
    };

    function sendMessage(message: any): Promise<any>;
    function getManifest(): {
      version: string;
      name: string;
    };
    function getURL(path: string): string;

    const id: string;
  }

  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
      active: boolean;
      highlighted: boolean;
      pinned: boolean;
      incognito: boolean;
    }

    interface TabChangeInfo {
      status?: 'loading' | 'complete';
      url?: string;
      pinned?: boolean;
      audible?: boolean;
      mutedInfo?: {
        muted: boolean;
        reason?: string;
        extensionId?: string;
      };
      favIconUrl?: string;
      title?: string;
    }

    const onUpdated: {
      addListener(
        callback: (tabId: number, changeInfo: TabChangeInfo, tab: Tab) => void
      ): void;
    };

    function query(queryInfo: { active?: boolean; currentWindow?: boolean }): Promise<Tab[]>;
    function sendMessage(tabId: number, message: any): Promise<any>;
    function create(createProperties: { url: string }): Promise<Tab>;
  }

  namespace storage {
    interface LocalStorageArea {
      get(keys?: string | string[] | object | null): Promise<{ [key: string]: any }>;
      set(items: object): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }

    interface StorageChange {
      oldValue?: any;
      newValue?: any;
    }

    const local: LocalStorageArea;

    const onChanged: {
      addListener(
        callback: (
          changes: { [key: string]: StorageChange },
          namespace: string
        ) => void
      ): void;
    };
  }

  namespace scripting {
    interface InjectionTarget {
      tabId?: number;
      frameIds?: number[];
      documentIds?: string[];
    }

    interface ScriptInjection {
      target: InjectionTarget;
      files?: string[];
      func?: Function;
      args?: any[];
    }

    function executeScript(injection: ScriptInjection): Promise<any[]>;
  }
}

declare const chrome: typeof chrome;
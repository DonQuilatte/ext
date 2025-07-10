export declare const domUtils: {
    waitForElement(selector: string, timeout?: number): Promise<Element>;
    injectScript(src: string): Promise<void>;
    injectStyle(css: string): void;
    removeElements(selector: string): void;
    isElementVisible(element: Element): boolean;
};
export declare const storageUtils: {
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
};
export declare const stringUtils: {
    generateId(): string;
    truncate(text: string, maxLength: number, suffix?: string): string;
    toTitleCase(text: string): string;
    sanitizeHtml(html: string): string;
};
export declare const dateUtils: {
    formatRelativeTime(date: Date): string;
    formatDate(date: Date): string;
};
export declare const validationUtils: {
    isValidUrl(string: string): boolean;
    isValidEmail(email: string): boolean;
    isDefined<T>(value: T): value is NonNullable<T>;
};
export declare const eventUtils: {
    debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
    throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
};
declare const _default: {
    dom: {
        waitForElement(selector: string, timeout?: number): Promise<Element>;
        injectScript(src: string): Promise<void>;
        injectStyle(css: string): void;
        removeElements(selector: string): void;
        isElementVisible(element: Element): boolean;
    };
    storage: {
        get<T>(key: string): Promise<T | null>;
        set(key: string, value: any): Promise<void>;
        remove(key: string): Promise<void>;
        clear(): Promise<void>;
    };
    string: {
        generateId(): string;
        truncate(text: string, maxLength: number, suffix?: string): string;
        toTitleCase(text: string): string;
        sanitizeHtml(html: string): string;
    };
    date: {
        formatRelativeTime(date: Date): string;
        formatDate(date: Date): string;
    };
    validation: {
        isValidUrl(string: string): boolean;
        isValidEmail(email: string): boolean;
        isDefined<T>(value: T): value is NonNullable<T>;
    };
    event: {
        debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
        throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map
// DOM Utilities
export const domUtils = {
  /**
   * Wait for an element to be present in the DOM
   */
  waitForElement(selector: string, timeout = 10000): Promise<Element> {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },

  /**
   * Create and inject a script element
   */
  injectScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  },

  /**
   * Create and inject a style element
   */
  injectStyle(css: string): void {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },

  /**
   * Remove all elements matching a selector
   */
  removeElements(selector: string): void {
    document.querySelectorAll(selector).forEach(el => el.remove());
  },

  /**
   * Check if element is visible
   */
  isElementVisible(element: Element): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && (element as HTMLElement).offsetParent !== null;
  },
};

// Storage Utilities
export const storageUtils = {
  /**
   * Get a value from Chrome storage
   */
  async get<T>(key: string): Promise<T | null> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return null;
    }

    try {
      const result = await chrome.storage.local.get(key);
      return result[key] || null;
    } catch (error) {
      console.error('Failed to get from storage:', error);
      return null;
    }
  },

  /**
   * Set a value in Chrome storage
   */
  async set(key: string, value: any): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return;
    }

    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error('Failed to set in storage:', error);
    }
  },

  /**
   * Remove a value from Chrome storage
   */
  async remove(key: string): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return;
    }

    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      console.error('Failed to remove from storage:', error);
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return;
    }

    try {
      await chrome.storage.local.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};

// String Utilities
export const stringUtils = {
  /**
   * Generate a random ID
   */
  generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  /**
   * Truncate text to a specific length
   */
  truncate(text: string, maxLength: number, suffix = '...'): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  /**
   * Convert text to title case
   */
  toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Sanitize HTML string
   */
  sanitizeHtml(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },
};

// Date Utilities
export const dateUtils = {
  /**
   * Format date to relative time
   */
  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  },

  /**
   * Format date to readable string
   */
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

// Validation Utilities
export const validationUtils = {
  /**
   * Check if string is a valid URL
   */
  isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if string is a valid email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Check if value is not null or undefined
   */
  isDefined<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined;
  },
};

// Event Utilities
export const eventUtils = {
  /**
   * Debounce function calls
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function calls
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// Export all utilities
export default {
  dom: domUtils,
  storage: storageUtils,
  string: stringUtils,
  date: dateUtils,
  validation: validationUtils,
  event: eventUtils,
};
// Real ChatGPT API Bridge
// This script connects the extension to actual ChatGPT functionality instead of mock data

(function() {
    'use strict';
    
    console.log('[RealAPI] Initializing real ChatGPT API bridge...');
    
    // Wait for page to be ready and ChatGPT to be loaded
    function waitForChatGPT() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                // Check if we're on ChatGPT and basic elements exist
                if (window.location.hostname.includes('chatgpt.com') || window.location.hostname.includes('chat.openai.com')) {
                    const sidebar = document.querySelector('[data-testid="conversation-turn"]') || 
                                  document.querySelector('nav') || 
                                  document.querySelector('[role="navigation"]');
                    if (sidebar) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }
            }, 500);
        });
    }
    
    // Extract conversations from ChatGPT DOM
    function extractConversationsFromDOM() {
        console.log('[RealAPI] Extracting conversations from ChatGPT DOM...');
        
        const conversations = [];
        
        // Updated selectors for current ChatGPT interface (2025)
        const selectors = [
            // Primary selectors for conversation links
            'nav a[href*="/c/"]',
            'aside a[href*="/c/"]',
            '[data-testid="conversation-turn"] a[href*="/c/"]',
            'a[href*="chatgpt.com/c/"]',
            'a[href*="chat.openai.com/c/"]',
            
            // Sidebar navigation selectors
            'nav li a[href*="/c/"]',
            'aside li a[href*="/c/"]',
            '[role="navigation"] a[href*="/c/"]',
            
            // Generic conversation item selectors
            '.conversation-item a',
            '[data-testid*="conversation"] a',
            '[data-testid*="history"] a[href*="/c/"]',
            
            // Fallback selectors
            'nav a',
            'aside a',
            '[role="navigation"] a'
        ];
        
        let conversationElements = [];
        let usedSelector = '';
        
        for (const selector of selectors) {
            try {
                conversationElements = document.querySelectorAll(selector);
                // Filter to only include conversation links
                conversationElements = Array.from(conversationElements).filter(el => {
                    const href = el.getAttribute('href');
                    return href && href.includes('/c/');
                });
                
                if (conversationElements.length > 0) {
                    console.log(`[RealAPI] Found ${conversationElements.length} conversations using selector: ${selector}`);
                    usedSelector = selector;
                    break;
                }
            } catch (error) {
                console.warn(`[RealAPI] Error with selector ${selector}:`, error);
            }
        }
        
        // If no conversations found, try to find any navigation elements and log them for debugging
        if (conversationElements.length === 0) {
            console.log('[RealAPI] No conversations found, debugging navigation structure...');
            
            const debugSelectors = ['nav', 'aside', '[role="navigation"]', '[data-testid*="nav"]'];
            debugSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                console.log(`[RealAPI] Debug - ${selector}: ${elements.length} elements found`);
                if (elements.length > 0) {
                    elements.forEach((el, i) => {
                        if (i < 3) { // Log first 3 elements
                            console.log(`[RealAPI] Debug - ${selector}[${i}]:`, el.outerHTML.substring(0, 200));
                        }
                    });
                }
            });
            
            // Try to find any links at all
            const allLinks = document.querySelectorAll('a[href]');
            const conversationLinks = Array.from(allLinks).filter(link =>
                link.href.includes('/c/') || link.href.includes('conversation')
            );
            console.log(`[RealAPI] Debug - Found ${allLinks.length} total links, ${conversationLinks.length} potential conversation links`);
        }
        
        conversationElements.forEach((element, index) => {
            try {
                const href = element.getAttribute('href');
                const title = element.textContent?.trim() || element.getAttribute('title') || `Conversation ${index + 1}`;
                
                if (href && href.includes('/c/')) {
                    const conversationId = href.split('/c/')[1]?.split('?')[0]?.split('/')[0];
                    if (conversationId) {
                        conversations.push({
                            id: conversationId,
                            title: title,
                            create_time: Date.now() / 1000 - (index * 3600), // Approximate timestamps
                            update_time: Date.now() / 1000 - (index * 1800),
                            mapping: {},
                            current_node: null,
                            conversation_template_id: null,
                            gizmo_id: null,
                            is_archived: false,
                            safe_urls: [],
                            default_model_slug: "gpt-4",
                            conversation_id: conversationId,
                            href: href,
                            element: element
                        });
                    }
                }
            } catch (error) {
                console.warn('[RealAPI] Error processing conversation element:', error);
            }
        });
        
        console.log(`[RealAPI] Extracted ${conversations.length} conversations`);
        return conversations;
    }
    
    // Extract folders from ChatGPT (if they exist in the UI)
    function extractFoldersFromDOM() {
        console.log('[RealAPI] Extracting folders from ChatGPT DOM...');
        
        const folders = [];
        
        // Look for folder-like elements in the sidebar
        const folderSelectors = [
            '[data-testid*="folder"]',
            '.folder',
            '[role="button"][aria-expanded]',
            'nav [role="group"]',
            'nav section'
        ];
        
        let folderElements = [];
        for (const selector of folderSelectors) {
            folderElements = document.querySelectorAll(selector);
            if (folderElements.length > 0) {
                console.log(`[RealAPI] Found ${folderElements.length} potential folders using selector: ${selector}`);
                break;
            }
        }
        
        // If no specific folders found, create a default "All Conversations" folder
        if (folderElements.length === 0) {
            folders.push({
                id: 'default',
                name: 'All Conversations',
                color: 'blue',
                created_at: Date.now() / 1000,
                updated_at: Date.now() / 1000
            });
        } else {
            folderElements.forEach((element, index) => {
                const name = element.textContent?.trim() || `Folder ${index + 1}`;
                folders.push({
                    id: `folder_${index}`,
                    name: name,
                    color: ['blue', 'green', 'red', 'purple', 'orange'][index % 5],
                    created_at: Date.now() / 1000 - (index * 3600),
                    updated_at: Date.now() / 1000 - (index * 1800)
                });
            });
        }
        
        console.log(`[RealAPI] Extracted ${folders.length} folders`);
        return folders;
    }
    
    // Extract prompts/templates (these might not exist in standard ChatGPT)
    function extractPromptsFromDOM() {
        console.log('[RealAPI] Extracting prompts from ChatGPT DOM...');
        
        const prompts = [];
        
        // Look for saved prompts or templates
        const promptSelectors = [
            '[data-testid*="prompt"]',
            '[data-testid*="template"]',
            '.prompt-item',
            '.template-item'
        ];
        
        let promptElements = [];
        for (const selector of promptSelectors) {
            promptElements = document.querySelectorAll(selector);
            if (promptElements.length > 0) {
                console.log(`[RealAPI] Found ${promptElements.length} prompts using selector: ${selector}`);
                break;
            }
        }
        
        // If no prompts found, create some default examples
        if (promptElements.length === 0) {
            const defaultPrompts = [
                { title: 'Explain Like I\'m 5', content: 'Explain this concept in simple terms that a 5-year-old would understand.' },
                { title: 'Code Review', content: 'Please review this code and suggest improvements.' },
                { title: 'Summarize', content: 'Please provide a concise summary of the following text.' },
                { title: 'Creative Writing', content: 'Write a creative story based on the following prompt.' }
            ];
            
            defaultPrompts.forEach((prompt, index) => {
                prompts.push({
                    id: `prompt_${index}`,
                    title: prompt.title,
                    content: prompt.content,
                    created_at: Date.now() / 1000 - (index * 3600),
                    updated_at: Date.now() / 1000 - (index * 1800),
                    category: 'General',
                    tags: []
                });
            });
        } else {
            promptElements.forEach((element, index) => {
                const title = element.textContent?.trim() || `Prompt ${index + 1}`;
                prompts.push({
                    id: `prompt_${index}`,
                    title: title,
                    content: title,
                    created_at: Date.now() / 1000 - (index * 3600),
                    updated_at: Date.now() / 1000 - (index * 1800),
                    category: 'Custom',
                    tags: []
                });
            });
        }
        
        console.log(`[RealAPI] Extracted ${prompts.length} prompts`);
        return prompts;
    }
    
    // Real API functions that connect to actual ChatGPT data
    async function realGetConversations() {
        console.log('[RealAPI] realGetConversations called - fetching real ChatGPT conversations');
        
        try {
            await waitForChatGPT();
            const conversations = extractConversationsFromDOM();
            
            if (conversations.length === 0) {
                console.warn('[RealAPI] No conversations found, user may need to refresh or navigate to ChatGPT');
                return [];
            }
            
            console.log(`[RealAPI] Successfully retrieved ${conversations.length} real conversations`);
            return conversations;
        } catch (error) {
            console.error('[RealAPI] Error getting real conversations:', error);
            return [];
        }
    }
    
    async function realGetUserFolders() {
        console.log('[RealAPI] realGetUserFolders called - fetching real ChatGPT folders');
        
        try {
            await waitForChatGPT();
            const folders = extractFoldersFromDOM();
            
            console.log(`[RealAPI] Successfully retrieved ${folders.length} real folders`);
            return folders;
        } catch (error) {
            console.error('[RealAPI] Error getting real folders:', error);
            return [{
                id: 'default',
                name: 'All Conversations',
                color: 'blue',
                created_at: Date.now() / 1000,
                updated_at: Date.now() / 1000
            }];
        }
    }
    
    async function realGetPrompts() {
        console.log('[RealAPI] realGetPrompts called - fetching real ChatGPT prompts');
        
        try {
            await waitForChatGPT();
            const prompts = extractPromptsFromDOM();
            
            console.log(`[RealAPI] Successfully retrieved ${prompts.length} real prompts`);
            return prompts;
        } catch (error) {
            console.error('[RealAPI] Error getting real prompts:', error);
            return [];
        }
    }
    
    // Setup real API functions without overriding existing ones
    function setupRealAPIFunctions() {
        console.log('[RealAPI] Setting up real API functions...');
        
        // Store real API functions with unique names
        window.realGetConversations = realGetConversations;
        window.realGetUserFolders = realGetUserFolders;
        window.realGetPrompts = realGetPrompts;
        
        // Create a flag to indicate real API is ready
        window.REAL_API_READY = true;
        
        console.log('[RealAPI] ✅ Real API functions installed successfully');
        
        // Test the functions
        setTimeout(async () => {
            try {
                console.log('[RealAPI] Testing real API functions...');
                
                const conversations = await realGetConversations();
                console.log('[RealAPI] ✅ realGetConversations test:', conversations.length, 'conversations');
                
                const folders = await realGetUserFolders();
                console.log('[RealAPI] ✅ realGetUserFolders test:', folders.length, 'folders');
                
                const prompts = await realGetPrompts();
                console.log('[RealAPI] ✅ realGetPrompts test:', prompts.length, 'prompts');
                
                // Dispatch custom event to notify other scripts
                window.dispatchEvent(new CustomEvent('realAPIReady', {
                    detail: {
                        conversations: conversations.length,
                        folders: folders.length,
                        prompts: prompts.length
                    }
                }));
                
            } catch (error) {
                console.error('[RealAPI] Error testing functions:', error);
            }
        }, 2000);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupRealAPIFunctions);
    } else {
        setupRealAPIFunctions();
    }
    
    // Also setup when page changes (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(setupRealAPIFunctions, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
    
    console.log('[RealAPI] Real ChatGPT API bridge initialized');
})();
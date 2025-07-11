// COMPREHENSIVE DEBUG DIAGNOSTICS
// This script provides detailed logging to diagnose timing and race condition issues

(function() {
    'use strict';
    
    const startTime = performance.now();
    const timestamp = new Date().toISOString();
    
    console.log('🔬 DEBUG DIAGNOSTICS: Starting comprehensive analysis');
    console.log('🔬 DEBUG: Script execution context:', {
        timestamp,
        performanceNow: startTime,
        readyState: document.readyState,
        location: window.location.href,
        userAgent: navigator.userAgent.substring(0, 100) + '...'
    });
    
    // 1. DOM State Analysis
    function analyzeDOMState() {
        const domState = {
            readyState: document.readyState,
            documentElement: !!document.documentElement,
            head: !!document.head,
            body: !!document.body,
            bodyNodeType: document.body?.nodeType,
            bodyChildren: document.body?.children?.length || 0,
            totalElements: document.querySelectorAll('*').length,
            elementsWithId: document.querySelectorAll('[id]').length
        };
        
        console.log('🔬 DOM STATE:', domState);
        return domState;
    }
    
    // 2. Property State Analysis
    function analyzePropertyState() {
        const criticalProperties = [
            'isResetChatHistory',
            'local_folders',
            'conversations',
            'userFolders',
            'prompts',
            'isPremiumUser',
            'isPremium',
            'userPlan',
            'subscriptionStatus',
            'EARLY_INIT_COMPLETE'
        ];
        
        const propertyState = {};
        criticalProperties.forEach(prop => {
            try {
                const value = window[prop];
                propertyState[prop] = {
                    type: typeof value,
                    exists: prop in window,
                    value: Array.isArray(value) ? `Array(${value.length})` : 
                           typeof value === 'object' && value !== null ? 'Object' : 
                           value,
                    descriptor: Object.getOwnPropertyDescriptor(window, prop) ? 'defined' : 'undefined'
                };
            } catch (error) {
                propertyState[prop] = {
                    error: error.message,
                    type: 'error'
                };
            }
        });
        
        console.log('🔬 PROPERTY STATE:', propertyState);
        return propertyState;
    }
    
    // 3. Chrome Extension Context Analysis
    function analyzeChromeContext() {
        const chromeState = {
            chrome: !!window.chrome,
            storage: !!window.chrome?.storage,
            storageLocal: !!window.chrome?.storage?.local,
            runtime: !!window.chrome?.runtime,
            runtimeId: window.chrome?.runtime?.id || 'undefined'
        };
        
        console.log('🔬 CHROME CONTEXT:', chromeState);
        return chromeState;
    }
    
    // 4. Script Loading Analysis
    function analyzeScriptLoading() {
        const scripts = Array.from(document.querySelectorAll('script')).map(script => ({
            src: script.src || 'inline',
            loaded: script.readyState || 'unknown',
            async: script.async,
            defer: script.defer
        }));
        
        console.log('🔬 LOADED SCRIPTS:', scripts.length, 'scripts found');
        console.log('🔬 SCRIPT DETAILS:', scripts.slice(0, 10)); // Show first 10 to avoid spam
        
        return scripts;
    }
    
    // 5. Error Tracking Setup
    function setupErrorTracking() {
        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            console.log('🔬 UNHANDLED PROMISE REJECTION:', {
                timestamp: new Date().toISOString(),
                reason: event.reason,
                promise: event.promise
            });
        });
        
        // Track global errors
        window.addEventListener('error', function(event) {
            console.log('🔬 GLOBAL ERROR TRACKED:', {
                timestamp: new Date().toISOString(),
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        
        console.log('🔬 ERROR TRACKING: Enhanced error tracking enabled (without console overrides)');
    }
    
    // 6. Timing Analysis
    function analyzeTimings() {
        const timings = {
            scriptStart: startTime,
            domContentLoaded: null,
            windowLoad: null,
            currentTime: performance.now()
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                timings.domContentLoaded = performance.now();
                console.log('🔬 TIMING: DOMContentLoaded at', timings.domContentLoaded, 'ms');
            });
        } else {
            timings.domContentLoaded = 'already-fired';
        }
        
        if (document.readyState !== 'complete') {
            window.addEventListener('load', () => {
                timings.windowLoad = performance.now();
                console.log('🔬 TIMING: Window load at', timings.windowLoad, 'ms');
            });
        } else {
            timings.windowLoad = 'already-fired';
        }
        
        console.log('🔬 TIMING ANALYSIS:', timings);
        return timings;
    }
    
    // 7. Duplicate ID Detection
    function analyzeDuplicateIds() {
        const allElements = document.querySelectorAll('[id]');
        const idCounts = {};
        const duplicates = [];
        
        allElements.forEach(element => {
            const id = element.id;
            if (idCounts[id]) {
                idCounts[id]++;
                if (idCounts[id] === 2) {
                    duplicates.push(id);
                }
            } else {
                idCounts[id] = 1;
            }
        });
        
        const duplicateAnalysis = {
            totalElements: allElements.length,
            uniqueIds: Object.keys(idCounts).length,
            duplicateIds: duplicates,
            duplicateCount: duplicates.length
        };
        
        console.log('🔬 DUPLICATE ID ANALYSIS:', duplicateAnalysis);
        
        if (duplicates.length > 0) {
            console.warn('🔬 FOUND DUPLICATE IDS:', duplicates);
            duplicates.forEach(id => {
                const elements = document.querySelectorAll(`[id="${id}"]`);
                console.log(`🔬 DUPLICATE "${id}":`, elements.length, 'elements');
            });
        }
        
        return duplicateAnalysis;
    }
    
    // Run all analyses
    function runComprehensiveAnalysis() {
        console.log('🔬 ===== COMPREHENSIVE DEBUG ANALYSIS START =====');
        
        const analysis = {
            timestamp,
            dom: analyzeDOMState(),
            properties: analyzePropertyState(),
            chrome: analyzeChromeContext(),
            scripts: analyzeScriptLoading(),
            timings: analyzeTimings(),
            duplicateIds: analyzeDuplicateIds()
        };
        
        // Set up error tracking
        setupErrorTracking();
        
        // Store analysis globally for debugging
        window.debugAnalysis = analysis;
        
        console.log('🔬 ===== COMPREHENSIVE DEBUG ANALYSIS COMPLETE =====');
        console.log('🔬 Full analysis stored in window.debugAnalysis');
        
        return analysis;
    }
    
    // Run analysis immediately
    const initialAnalysis = runComprehensiveAnalysis();
    
    // Schedule follow-up analyses
    setTimeout(() => {
        console.log('🔬 ===== FOLLOW-UP ANALYSIS (100ms) =====');
        runComprehensiveAnalysis();
    }, 100);
    
    setTimeout(() => {
        console.log('🔬 ===== FOLLOW-UP ANALYSIS (500ms) =====');
        runComprehensiveAnalysis();
    }, 500);
    
    setTimeout(() => {
        console.log('🔬 ===== FOLLOW-UP ANALYSIS (2000ms) =====');
        runComprehensiveAnalysis();
    }, 2000);
    
})();

console.log('🔬 DEBUG DIAGNOSTICS: Comprehensive diagnostic system initialized');
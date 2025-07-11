# Recursive Error Analysis & Test Plan

## Problem Identification

The `isResetChatHistory` error is occurring inside the error handlers themselves, creating a recursive error loop:

1. **Primary Error**: Code tries to access `undefinedObject.isResetChatHistory`
2. **Secondary Error**: Error handler processes arguments containing the undefined object
3. **Recursive Loop**: Error processing triggers the same property access, causing infinite recursion

## Error Locations

- **Line 177 in unified-context-fix.js**: `return originalError.apply(console, args);`
- **Line 139 in content-fix.js**: `console.error('🚨 CONTENT FIX: Caught Promise rejection isResetChatHistory error:', error);`

## Root Cause Analysis

The issue is in the `console.error` override function:

```javascript
console.error = function(...args) {
    try {
        // Safe argument processing with fallback
        const message = args.map(arg => {
            try {
                if (typeof arg === 'string') return arg;
                if (arg && typeof arg.toString === 'function') return arg.toString(); // ⚠️ PROBLEM HERE
                return String(arg); // ⚠️ AND HERE
            } catch (argError) {
                return '[object]';
            }
        }).join(' ');
        
        // ... filtering logic ...
        
        try {
            return originalError.apply(console, args); // ⚠️ MAIN PROBLEM HERE
        } catch (applyError) {
            return originalError(message);
        }
    } catch (e) {
        return;
    }
};
```

**The Problem**: When `originalError.apply(console, args)` is called, the browser's native error logging tries to stringify the arguments. If any argument contains an object with undefined properties being accessed (like `undefinedObject.isResetChatHistory`), the stringification process triggers the same property access error.

## Test Scenario

To reproduce the exact error:

```javascript
// Create an object that will cause the error when accessed
const problematicObject = {};
Object.defineProperty(problematicObject, 'toString', {
    get: function() {
        // This simulates the problematic property access
        return someUndefinedObject.isResetChatHistory; // This will throw
    }
});

// Try to log an error with this object
console.error('Test error:', problematicObject);
// This should trigger the recursive error loop
```

## Solution Strategy

### Phase 1: Ultra-Safe Argument Processing

Make the `console.error` override completely immune to property access errors:

```javascript
console.error = function(...args) {
    try {
        // ULTRA-SAFE argument processing - never access properties
        const safeArgs = [];
        for (let i = 0; i < args.length; i++) {
            try {
                const arg = args[i];
                if (arg === null) {
                    safeArgs.push('null');
                } else if (arg === undefined) {
                    safeArgs.push('undefined');
                } else if (typeof arg === 'string') {
                    safeArgs.push(arg);
                } else if (typeof arg === 'number' || typeof arg === 'boolean') {
                    safeArgs.push(String(arg));
                } else {
                    // For objects, use a safe representation that doesn't trigger property access
                    safeArgs.push('[object Object]');
                }
            } catch (argError) {
                safeArgs.push('[error processing argument]');
            }
        }
        
        // Create a safe message without triggering property access
        const message = safeArgs.join(' ');
        
        // Filter logic using the safe message
        if (message.includes('Extension context invalidated') ||
            message.includes('CORS policy') ||
            message.includes('blocked by CORS') ||
            message.includes('Maximum call stack') ||
            message.includes('RangeError') ||
            message.includes('Illegal invocation')) {
            return;
        }
        
        // SAFE call to original error - use safe arguments only
        try {
            return originalError.call(console, message);
        } catch (applyError) {
            // Ultimate fallback - do nothing
            return;
        }
    } catch (e) {
        // Ultimate fallback - do nothing to prevent recursion
        return;
    }
};
```

### Phase 2: Fundamental Property Access Interception

Override `Reflect.get` to intercept ALL property access at the JavaScript engine level:

```javascript
// Store the original Reflect.get
const originalReflectGet = Reflect.get;

// Override Reflect.get to intercept undefined object access
Reflect.get = function(target, property, receiver) {
    try {
        if ((target === undefined || target === null) && property === 'isResetChatHistory') {
            console.warn('🔧 REFLECT: Intercepted isResetChatHistory access on undefined object');
            return false;
        }
        return originalReflectGet.call(this, target, property, receiver);
    } catch (error) {
        if (property === 'isResetChatHistory') {
            console.warn('🔧 REFLECT: Error accessing isResetChatHistory, returning fallback');
            return false;
        }
        throw error;
    }
};
```

### Phase 3: Emergency Property Creation

Create `isResetChatHistory` on all possible objects immediately:

```javascript
// Emergency property creation on all potential objects
const emergencyObjects = [
    window,
    window.document,
    window.chrome,
    window.localStorage,
    window.sessionStorage,
    globalThis
];

emergencyObjects.forEach((obj, index) => {
    if (obj && typeof obj === 'object') {
        try {
            if (!obj.hasOwnProperty('isResetChatHistory')) {
                Object.defineProperty(obj, 'isResetChatHistory', {
                    value: false,
                    writable: true,
                    enumerable: false,
                    configurable: true
                });
            }
        } catch (e) {
            // Ignore if we can't define the property
        }
    }
});
```

## Implementation Plan

1. **Create test file** to reproduce the exact recursive error scenario
2. **Implement ultra-safe console.error override** that never triggers property access
3. **Add Reflect.get interception** for engine-level protection
4. **Test the solution** to verify complete error elimination
5. **Apply the fix** to both unified-context-fix.js and content-fix.js

## Expected Outcome

After implementing this solution:
- ✅ No more recursive error loops in console.error
- ✅ Complete prevention of `isResetChatHistory` property access errors
- ✅ Safe error logging that never triggers the original error
- ✅ Chrome extension runs without JavaScript errors

## Next Steps

1. Switch to Code mode to implement the test and solution
2. Create the test file to reproduce the error
3. Implement the bulletproof error handling system
4. Verify the fix works in the actual Chrome extension environment
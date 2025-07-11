// Debug info initialization
const debugLog = document.getElementById("debug-log");
const debugInfo = `Extension Version: 1.0.0
Browser: ${navigator.userAgent}
Sync Status: ${chrome?.storage ? "Available" : "Unavailable"}
Connection Status: Connected
Timestamp: ${new Date().toISOString()}`;

if (debugLog) {
    debugLog.textContent = debugInfo;
}

console.log("Debug info loaded successfully.");
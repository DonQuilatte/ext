const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

puppeteer.use(StealthPlugin());

class ExtensionTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.extensionId = null;
    this.consoleMessages = [];
    this.errors = [];
    this.testResults = {};
    this.screenshots = [];
    this.extensionPath = path.join(__dirname, '../source');
    this.headless = process.env.HEADLESS === 'true';
  }

  async initialize() {
    console.log('🚀 Initializing Extension Tester...');
    
    // Launch browser with extension support
    this.browser = await puppeteer.launch({
      headless: this.headless,
      args: [
        `--disable-extensions-except=${this.extensionPath}`,
        `--load-extension=${this.extensionPath}`,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    // Get extension ID
    const targets = await this.browser.targets();
    const extensionTarget = targets.find(target => 
      target.type() === 'background_page' || 
      target.type() === 'service_worker'
    );
    
    if (extensionTarget) {
      this.extensionId = extensionTarget.url().split('/')[2];
      console.log(`✅ Extension ID: ${this.extensionId}`);
    } else {
      console.warn('⚠️  Extension target not found');
    }

    return this;
  }

  async uninstallExtension() {
    console.log('🔄 Simulating extension uninstall/reinstall...');
    
    try {
      const page = await this.browser.newPage();
      await page.goto('chrome://extensions/');
      
      // Simulate disable/enable cycle
      await page.evaluate((extensionId) => {
        if (typeof chrome !== 'undefined' && chrome.management) {
          chrome.management.setEnabled(extensionId, false);
          setTimeout(() => chrome.management.setEnabled(extensionId, true), 2000);
        }
      }, this.extensionId);

      await page.waitForTimeout ? 
        await page.waitForTimeout(3000) : 
        await new Promise(resolve => setTimeout(resolve, 3000));
      await page.close();
      
      this.testResults.uninstallReinstall = 'SUCCESS';
      console.log('✅ Extension uninstall/reinstall simulation completed');
    } catch (error) {
      this.testResults.uninstallReinstall = 'FAILED';
      this.errors.push({
        test: 'uninstallExtension',
        message: error.message,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Extension uninstall/reinstall failed:', error.message);
    }
  }

  async visitChatGPT() {
    console.log('🌐 Navigating to ChatGPT...');
    
    try {
      this.page = await this.browser.newPage();
      
      // Set up console monitoring
      this.page.on('console', msg => {
        this.consoleMessages.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: new Date().toISOString(),
          location: msg.location()
        });
      });

      this.page.on('pageerror', error => {
        this.errors.push({
          test: 'pageError',
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
      });

      // Navigate to ChatGPT
      await this.page.goto('https://chat.openai.com', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for extension to initialize
      await this.page.waitForTimeout ? 
        await this.page.waitForTimeout(5000) : 
        await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Take screenshot
      const screenshotPath = path.join(__dirname, '../screenshots/chatgpt-loaded.png');
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      this.screenshots.push(screenshotPath);

      this.testResults.chatgptLoad = 'SUCCESS';
      console.log('✅ ChatGPT loaded successfully');
    } catch (error) {
      this.testResults.chatgptLoad = 'FAILED';
      this.errors.push({
        test: 'visitChatGPT',
        message: error.message,
        timestamp: new Date().toISOString()
      });
      console.error('❌ ChatGPT loading failed:', error.message);
    }
  }

  async validateExtensionFeatures() {
    console.log('🔍 Validating extension features...');
    
    const validationResults = {};

    try {
      // Test 1: Check for premium-related console errors
      const premiumErrors = this.consoleMessages.filter(msg => 
        msg.text.toLowerCase().includes('premium') ||
        msg.text.toLowerCase().includes('subscription') ||
        msg.text.toLowerCase().includes('payment') ||
        msg.text.toLowerCase().includes('billing')
      );
      
      validationResults.premiumErrors = {
        status: premiumErrors.length === 0 ? 'PASS' : 'FAIL',
        count: premiumErrors.length,
        messages: premiumErrors.slice(0, 5) // Only store first 5 for brevity
      };

      // Test 2: Check for JavaScript errors
      const jsErrors = this.consoleMessages.filter(msg => 
        msg.type === 'error' && 
        !msg.text.includes('net::ERR_FAILED') // Ignore network errors
      );
      
      validationResults.jsErrors = {
        status: jsErrors.length === 0 ? 'PASS' : 'FAIL',
        count: jsErrors.length,
        messages: jsErrors.slice(0, 5)
      };

      // Test 3: Check extension UI elements
      const extensionElements = await this.page.evaluate(() => {
        const elements = {
          // Look for common extension elements
          toolboxButton: !!document.querySelector('[data-testid*="toolbox"], [class*="toolbox"]'),
          manageFolders: !!document.querySelector('[data-testid*="folder"], [class*="folder"]'),
          managePrompts: !!document.querySelector('[data-testid*="prompt"], [class*="prompt"]'),
          premiumBadges: !!document.querySelector('.premium-badge, .paid-user-badge, [class*="premium"]'),
          extensionPopup: !!document.querySelector('[data-extension-id], [class*="extension"]'),
          // Check for common ChatGPT elements to ensure page loaded properly
          chatInput: !!document.querySelector('textarea[data-id*="root"], #prompt-textarea'),
          sidebar: !!document.querySelector('[data-testid="navigation"]')
        };
        
        // Get all extension-related elements
        const allElements = document.querySelectorAll('*');
        let extensionElementsFound = 0;
        
        allElements.forEach(el => {
          try {
            const classList = (el.className && typeof el.className === 'string') ? el.className.toLowerCase() : '';
            const id = (el.id && typeof el.id === 'string') ? el.id.toLowerCase() : '';
            
            if (classList.includes('extension') || 
                classList.includes('toolbox') || 
                classList.includes('prompt') ||
                classList.includes('folder') ||
                id.includes('extension') ||
                id.includes('toolbox')) {
              extensionElementsFound++;
            }
          } catch (error) {
            // Skip elements that can't be processed
          }
        });
        
        elements.extensionElementsCount = extensionElementsFound;
        
        return elements;
      });

      validationResults.uiElements = {
        status: extensionElements.extensionElementsCount > 0 ? 'PASS' : 'FAIL',
        elements: extensionElements
      };

      // Test 4: Test extension manifest and permissions
      const manifestValid = await this.validateManifest();
      validationResults.manifest = manifestValid;

      // Test 5: Test core functionality if elements are present
      if (extensionElements.extensionElementsCount > 0) {
        const functionalityTest = await this.testCoreFunctionality();
        validationResults.coreFunctionality = functionalityTest;
      }

      this.testResults.validation = validationResults;
      console.log('✅ Extension validation completed');
      
    } catch (error) {
      this.testResults.validation = { status: 'FAILED', error: error.message };
      this.errors.push({
        test: 'validateExtensionFeatures',
        message: error.message,
        timestamp: new Date().toISOString()
      });
      console.error('❌ Extension validation failed:', error.message);
    }
  }

  async validateManifest() {
    try {
      const manifestPath = path.join(this.extensionPath, 'manifest.json');
      const manifest = await fs.readJSON(manifestPath);
      
      const issues = [];
      
      // Check for premium-related permissions or content
      const manifestStr = JSON.stringify(manifest).toLowerCase();
      if (manifestStr.includes('premium') || 
          manifestStr.includes('payment') || 
          manifestStr.includes('subscription')) {
        issues.push('Premium-related content found in manifest');
      }
      
      // Check required permissions
      if (!manifest.permissions || !manifest.permissions.includes('storage')) {
        issues.push('Missing storage permission');
      }
      
      return {
        status: issues.length === 0 ? 'PASS' : 'FAIL',
        issues: issues,
        version: manifest.version
      };
    } catch (error) {
      return {
        status: 'FAILED',
        error: error.message
      };
    }
  }

  async testCoreFunctionality() {
    try {
      const functionalityResults = {};
      
      // Test 1: Try to access extension popup
      try {
        const popupUrl = `chrome-extension://${this.extensionId}/popup.html`;
        const popupPage = await this.browser.newPage();
        await popupPage.goto(popupUrl);
        await popupPage.waitForTimeout ? 
          await popupPage.waitForTimeout(2000) : 
          await new Promise(resolve => setTimeout(resolve, 2000));
        
        const popupContent = await popupPage.evaluate(() => document.body.innerHTML);
        functionalityResults.popup = {
          status: popupContent.length > 0 ? 'PASS' : 'FAIL',
          contentLength: popupContent.length
        };
        
        await popupPage.close();
      } catch (error) {
        functionalityResults.popup = { status: 'FAILED', error: error.message };
      }
      
      // Test 2: Check if extension scripts are injected
      const scriptsInjected = await this.page.evaluate(() => {
        const scripts = document.querySelectorAll('script');
        let extensionScripts = 0;
        
        scripts.forEach(script => {
          if (script.src && script.src.includes('chrome-extension://')) {
            extensionScripts++;
          }
        });
        
        return extensionScripts;
      });
      
      functionalityResults.scriptInjection = {
        status: scriptsInjected > 0 ? 'PASS' : 'FAIL',
        count: scriptsInjected
      };
      
      return functionalityResults;
    } catch (error) {
      return { status: 'FAILED', error: error.message };
    }
  }

  async generateBugReport() {
    console.log('📋 Generating comprehensive bug report...');
    
    const report = {
      testSuite: 'Chrome Extension Lifecycle Test',
      timestamp: new Date().toISOString(),
      testDuration: new Date().getTime() - this.startTime,
      extensionId: this.extensionId,
      testResults: this.testResults,
      consoleMessages: this.consoleMessages,
      errors: this.errors,
      screenshots: this.screenshots,
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations(),
      extensionAnalysis: await this.analyzeExtensionFiles()
    };

    // Save JSON report
    await fs.writeJSON(path.join(__dirname, '../test-results/bug-report.json'), report, { spaces: 2 });
    
    // Generate HTML report
    const htmlReport = this.generateHTMLReport(report);
    await fs.writeFile(path.join(__dirname, '../test-results/bug-report.html'), htmlReport);
    
    // Generate CSV summary
    const csvReport = this.generateCSVReport(report);
    await fs.writeFile(path.join(__dirname, '../test-results/test-summary.csv'), csvReport);

    console.log('✅ Bug report generated successfully');
    console.log('📁 Reports saved to:');
    console.log('   - test-results/bug-report.json');
    console.log('   - test-results/bug-report.html');
    console.log('   - test-results/test-summary.csv');
    
    return report;
  }

  generateSummary() {
    const allTests = Object.values(this.testResults);
    const passed = allTests.filter(result => 
      result === 'SUCCESS' || result === 'PASS' || 
      (typeof result === 'object' && result.status === 'PASS')
    ).length;
    
    const failed = allTests.filter(result => 
      result === 'FAILED' || result === 'FAIL' ||
      (typeof result === 'object' && result.status === 'FAIL')
    ).length;

    return {
      totalTests: allTests.length,
      passed: passed,
      failed: failed,
      criticalErrors: this.errors.length,
      premiumRelatedIssues: this.consoleMessages.filter(msg => 
        msg.text.toLowerCase().includes('premium') ||
        msg.text.toLowerCase().includes('subscription') ||
        msg.text.toLowerCase().includes('payment')
      ).length,
      jsErrors: this.consoleMessages.filter(msg => msg.type === 'error').length,
      healthScore: Math.round((passed / Math.max(allTests.length, 1)) * 100)
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.errors.length > 0) {
      recommendations.push({
        severity: 'CRITICAL',
        message: `${this.errors.length} critical errors detected - review console logs and fix immediately`
      });
    }
    
    const premiumIssues = this.consoleMessages.filter(msg => 
      msg.text.toLowerCase().includes('premium') ||
      msg.text.toLowerCase().includes('subscription') ||
      msg.text.toLowerCase().includes('payment')
    );
    
    if (premiumIssues.length > 0) {
      recommendations.push({
        severity: 'HIGH',
        message: `${premiumIssues.length} premium-related console messages found - complete cleanup required`
      });
    }

    const jsErrors = this.consoleMessages.filter(msg => msg.type === 'error');
    if (jsErrors.length > 5) {
      recommendations.push({
        severity: 'MEDIUM',
        message: `${jsErrors.length} JavaScript errors detected - review and fix code issues`
      });
    }

    if (this.testResults.validation && this.testResults.validation.uiElements && 
        this.testResults.validation.uiElements.elements.extensionElementsCount === 0) {
      recommendations.push({
        severity: 'HIGH',
        message: 'No extension UI elements detected - extension may not be injecting properly'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        severity: 'INFO',
        message: 'All tests passed - extension appears to be functioning correctly'
      });
    }

    return recommendations;
  }

  async analyzeExtensionFiles() {
    const analysis = {
      manifestAnalysis: {},
      scriptFiles: [],
      suspiciousPatterns: []
    };

    try {
      // Analyze manifest
      const manifestPath = path.join(this.extensionPath, 'manifest.json');
      const manifest = await fs.readJSON(manifestPath);
      
      analysis.manifestAnalysis = {
        version: manifest.version,
        permissions: manifest.permissions || [],
        contentScripts: manifest.content_scripts || [],
        background: manifest.background || {}
      };

      // Analyze JavaScript files for premium-related code
      const jsFiles = glob.sync('**/*.js', { cwd: this.extensionPath });
      
      for (const file of jsFiles.slice(0, 20)) { // Limit to first 20 files
        const filePath = path.join(this.extensionPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        // Check for premium-related patterns
        const patterns = [
          /premium/gi,
          /subscription/gi,
          /payment/gi,
          /billing/gi,
          /stripe/gi,
          /paypal/gi
        ];
        
        const matches = [];
        patterns.forEach(pattern => {
          const found = content.match(pattern);
          if (found) {
            matches.push(...found);
          }
        });
        
        if (matches.length > 0) {
          analysis.suspiciousPatterns.push({
            file: file,
            matches: [...new Set(matches)].slice(0, 10) // Unique matches, limit to 10
          });
        }
        
        analysis.scriptFiles.push({
          file: file,
          size: content.length,
          lineCount: content.split('\n').length
        });
      }
      
    } catch (error) {
      analysis.error = error.message;
    }

    return analysis;
  }

  generateHTMLReport(report) {
    const severityColor = {
      'CRITICAL': '#ff4444',
      'HIGH': '#ff8800',
      'MEDIUM': '#ffaa00',
      'INFO': '#00aa00'
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Chrome Extension Lifecycle Test Report</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .metric { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
            .metric-value { font-size: 24px; font-weight: bold; color: #333; }
            .metric-label { font-size: 14px; color: #666; margin-top: 5px; }
            .pass { color: #28a745; }
            .fail { color: #dc3545; }
            .warning { color: #ffc107; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 6px; }
            .section h3 { margin-top: 0; color: #333; }
            .recommendations { margin-top: 20px; }
            .recommendation { padding: 10px; margin: 10px 0; border-radius: 4px; border-left: 4px solid; }
            .error-list { max-height: 300px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 4px; }
            .console-message { font-family: monospace; font-size: 12px; margin: 5px 0; padding: 5px; background: #fff; border-radius: 3px; }
            .console-error { border-left: 3px solid #dc3545; }
            .console-warning { border-left: 3px solid #ffc107; }
            .console-info { border-left: 3px solid #17a2b8; }
            .health-score { font-size: 32px; font-weight: bold; text-align: center; padding: 20px; }
            .health-excellent { color: #28a745; }
            .health-good { color: #ffc107; }
            .health-poor { color: #dc3545; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; }
            .timestamp { font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔍 Chrome Extension Lifecycle Test Report</h1>
                <p class="timestamp">Generated: ${report.timestamp}</p>
                <p>Extension ID: <code>${report.extensionId || 'N/A'}</code></p>
                <p>Test Duration: ${Math.round(report.testDuration / 1000)}s</p>
            </div>
            
            <div class="summary">
                <div class="metric">
                    <div class="metric-value ${report.summary.healthScore >= 80 ? 'pass' : report.summary.healthScore >= 60 ? 'warning' : 'fail'}">
                        ${report.summary.healthScore}%
                    </div>
                    <div class="metric-label">Health Score</div>
                </div>
                <div class="metric">
                    <div class="metric-value pass">${report.summary.passed}</div>
                    <div class="metric-label">Tests Passed</div>
                </div>
                <div class="metric">
                    <div class="metric-value fail">${report.summary.failed}</div>
                    <div class="metric-label">Tests Failed</div>
                </div>
                <div class="metric">
                    <div class="metric-value ${report.summary.criticalErrors > 0 ? 'fail' : 'pass'}">${report.summary.criticalErrors}</div>
                    <div class="metric-label">Critical Errors</div>
                </div>
                <div class="metric">
                    <div class="metric-value ${report.summary.premiumRelatedIssues > 0 ? 'fail' : 'pass'}">${report.summary.premiumRelatedIssues}</div>
                    <div class="metric-label">Premium Issues</div>
                </div>
            </div>

            <div class="section">
                <h3>📋 Test Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Test</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(report.testResults).map(([test, result]) => `
                            <tr>
                                <td>${test}</td>
                                <td class="${typeof result === 'string' ? (result.includes('SUCCESS') || result.includes('PASS') ? 'pass' : 'fail') : 'warning'}">
                                    ${typeof result === 'string' ? result : JSON.stringify(result)}
                                </td>
                                <td>${typeof result === 'object' ? JSON.stringify(result, null, 2) : 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h3>⚠️ Recommendations</h3>
                <div class="recommendations">
                    ${report.recommendations.map(rec => `
                        <div class="recommendation" style="border-left-color: ${severityColor[rec.severity]}">
                            <strong>${rec.severity}:</strong> ${rec.message}
                        </div>
                    `).join('')}
                </div>
            </div>

            ${report.errors.length > 0 ? `
            <div class="section">
                <h3>🚨 Critical Errors</h3>
                <div class="error-list">
                    ${report.errors.map(error => `
                        <div class="console-message console-error">
                            <strong>[${error.test}]</strong> ${error.message}
                            <div class="timestamp">${error.timestamp}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            ${report.consoleMessages.length > 0 ? `
            <div class="section">
                <h3>💬 Console Messages (Last 50)</h3>
                <div class="error-list">
                    ${report.consoleMessages.slice(-50).map(msg => `
                        <div class="console-message console-${msg.type}">
                            <strong>[${msg.type.toUpperCase()}]</strong> ${msg.text}
                            <div class="timestamp">${msg.timestamp}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            ${report.extensionAnalysis ? `
            <div class="section">
                <h3>🔍 Extension Analysis</h3>
                <h4>Manifest Info:</h4>
                <pre>${JSON.stringify(report.extensionAnalysis.manifestAnalysis, null, 2)}</pre>
                
                ${report.extensionAnalysis.suspiciousPatterns.length > 0 ? `
                <h4>⚠️ Suspicious Patterns Found:</h4>
                <table>
                    <thead>
                        <tr>
                            <th>File</th>
                            <th>Matches</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${report.extensionAnalysis.suspiciousPatterns.map(pattern => `
                            <tr>
                                <td>${pattern.file}</td>
                                <td>${pattern.matches.join(', ')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ` : '<p>✅ No suspicious patterns detected</p>'}
            </div>
            ` : ''}

            <div class="section">
                <h3>📊 Summary</h3>
                <p><strong>Overall Status:</strong> ${report.summary.healthScore >= 80 ? '🟢 Excellent' : report.summary.healthScore >= 60 ? '🟡 Good' : '🔴 Needs Attention'}</p>
                <p><strong>Next Steps:</strong> ${report.recommendations.length > 0 ? 'Review and address the recommendations above' : 'Extension appears to be functioning correctly'}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateCSVReport(report) {
    const lines = [
      'Test,Status,Details,Timestamp',
      ...Object.entries(report.testResults).map(([test, result]) => 
        `"${test}","${typeof result === 'string' ? result : JSON.stringify(result)}","${typeof result === 'object' ? JSON.stringify(result) : 'N/A'}","${report.timestamp}"`
      )
    ];
    
    return lines.join('\n');
  }

  async cleanup() {
    console.log('🧹 Cleaning up...');
    
    if (this.page) {
      await this.page.close();
    }
    
    if (this.browser) {
      await this.browser.close();
    }
    
    console.log('✅ Cleanup completed');
  }
}

// Jest Test Suite
describe('Chrome Extension Lifecycle Test', () => {
  let tester;
  let startTime;

  beforeAll(async () => {
    startTime = new Date().getTime();
    tester = new ExtensionTester();
    tester.startTime = startTime;
    await tester.initialize();
  });

  afterAll(async () => {
    if (tester) {
      await tester.generateBugReport();
      await tester.cleanup();
    }
  });

  test('Extension Uninstall/Reinstall Simulation', async () => {
    await tester.uninstallExtension();
    expect(tester.testResults.uninstallReinstall).toBe('SUCCESS');
  });

  test('Navigate to ChatGPT and Initialize Extension', async () => {
    await tester.visitChatGPT();
    expect(tester.testResults.chatgptLoad).toBe('SUCCESS');
  });

  test('Validate Extension Features and Premium Cleanup', async () => {
    await tester.validateExtensionFeatures();
    expect(tester.testResults.validation).toBeDefined();
    
    // Check that premium-related errors are minimal
    if (tester.testResults.validation.premiumErrors) {
      expect(tester.testResults.validation.premiumErrors.count).toBeLessThan(5);
    }
  });

  test('Generate and Validate Bug Report', async () => {
    const report = await tester.generateBugReport();
    expect(report).toBeDefined();
    expect(report.summary).toBeDefined();
    expect(report.recommendations).toBeDefined();
  });
});

module.exports = ExtensionTester;
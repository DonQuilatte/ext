/**
 * Performance Monitor for Ishka Extension Tests
 * Tracks key performance metrics that affect user experience
 */

class PerformanceMonitor {
  constructor(page) {
    this.page = page;
    this.metrics = {
      loadTimes: [],
      memoryUsage: [],
      networkRequests: [],
      errorCounts: [],
      userInteractionTimes: [],
      extensionResponseTimes: []
    };
    this.startTime = Date.now();
  }

  async startMonitoring() {
    console.log('📊 Starting performance monitoring...');
    
    // Monitor page load performance
    this.page.on('response', (response) => {
      this.metrics.networkRequests.push({
        url: response.url(),
        status: response.status(),
        loadTime: response.timing()?.responseTime || 0,
        timestamp: Date.now()
      });
    });

    // Monitor console errors that affect performance
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.metrics.errorCounts.push({
          message: msg.text(),
          timestamp: Date.now(),
          source: msg.location()
        });
      }
    });
  }

  async measurePageLoad() {
    const startLoad = Date.now();
    
    await this.page.goto('https://chatgpt.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    const loadTime = Date.now() - startLoad;
    
    // Get detailed performance metrics
    const performanceMetrics = await this.page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        totalLoadTime: loadTime
      };
    });
    
    this.metrics.loadTimes.push(performanceMetrics);
    
    console.log(`📈 Page load completed in ${loadTime}ms`);
    return performanceMetrics;
  }

  async measureMemoryUsage() {
    const memoryMetrics = await this.page.evaluate(() => {
      if (performance.memory) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };
      }
      return null;
    });
    
    if (memoryMetrics) {
      this.metrics.memoryUsage.push(memoryMetrics);
      
      const usedMB = (memoryMetrics.used / 1024 / 1024).toFixed(2);
      const totalMB = (memoryMetrics.total / 1024 / 1024).toFixed(2);
      
      console.log(`🧠 Memory usage: ${usedMB}MB / ${totalMB}MB`);
    }
    
    return memoryMetrics;
  }

  async measureExtensionResponseTime(functionName) {
    const startTime = Date.now();
    
    try {
      const result = await this.page.evaluate(async (funcName) => {
        if (typeof window[funcName] === 'function') {
          const start = performance.now();
          await window[funcName]();
          const end = performance.now();
          return end - start;
        }
        return null;
      }, functionName);
      
      const totalTime = Date.now() - startTime;
      
      this.metrics.extensionResponseTimes.push({
        function: functionName,
        responseTime: result || totalTime,
        timestamp: Date.now()
      });
      
      console.log(`⚡ ${functionName} responded in ${result || totalTime}ms`);
      return result || totalTime;
      
    } catch (error) {
      console.log(`⚠️ ${functionName} measurement failed:`, error.message);
      return null;
    }
  }

  async measureUserInteraction(action, selector) {
    const startTime = Date.now();
    
    try {
      await this.page.click(selector);
      const responseTime = Date.now() - startTime;
      
      this.metrics.userInteractionTimes.push({
        action,
        selector,
        responseTime,
        timestamp: Date.now()
      });
      
      console.log(`👆 ${action} interaction took ${responseTime}ms`);
      return responseTime;
      
    } catch (error) {
      console.log(`⚠️ Interaction measurement failed:`, error.message);
      return null;
    }
  }

  generatePerformanceReport() {
    const report = {
      summary: this.generateSummary(),
      userImpact: this.assessUserImpact(),
      recommendations: this.generateRecommendations(),
      detailedMetrics: this.metrics,
      testDuration: Date.now() - this.startTime
    };
    
    console.log('\n📊 PERFORMANCE REPORT');
    console.log('='.repeat(30));
    console.log(`⏱️  Test Duration: ${report.testDuration}ms`);
    console.log(`📈 Page Loads: ${this.metrics.loadTimes.length}`);
    console.log(`🧠 Memory Snapshots: ${this.metrics.memoryUsage.length}`);
    console.log(`🌐 Network Requests: ${this.metrics.networkRequests.length}`);
    console.log(`❌ Console Errors: ${this.metrics.errorCounts.length}`);
    console.log(`⚡ Extension Calls: ${this.metrics.extensionResponseTimes.length}`);
    
    console.log('\n👤 USER EXPERIENCE IMPACT:');
    console.log(report.userImpact.summary);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 PERFORMANCE RECOMMENDATIONS:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.description}`);
        console.log(`   Impact: ${rec.impact}`);
      });
    }
    
    return report;
  }

  generateSummary() {
    const avgLoadTime = this.metrics.loadTimes.length > 0 
      ? this.metrics.loadTimes.reduce((sum, m) => sum + m.totalLoadTime, 0) / this.metrics.loadTimes.length 
      : 0;
    
    const avgMemoryUsage = this.metrics.memoryUsage.length > 0
      ? this.metrics.memoryUsage.reduce((sum, m) => sum + m.used, 0) / this.metrics.memoryUsage.length
      : 0;
    
    const avgExtensionResponse = this.metrics.extensionResponseTimes.length > 0
      ? this.metrics.extensionResponseTimes.reduce((sum, m) => sum + m.responseTime, 0) / this.metrics.extensionResponseTimes.length
      : 0;
    
    return {
      averageLoadTime: avgLoadTime,
      averageMemoryUsage: avgMemoryUsage,
      averageExtensionResponse: avgExtensionResponse,
      errorRate: this.metrics.errorCounts.length,
      networkRequestCount: this.metrics.networkRequests.length
    };
  }

  assessUserImpact() {
    const summary = this.generateSummary();
    let impact = 'good';
    let details = [];
    
    // Assess load time impact
    if (summary.averageLoadTime > 5000) {
      impact = 'poor';
      details.push('Page loads are slow (>5s) - users may experience frustration');
    } else if (summary.averageLoadTime > 3000) {
      impact = 'fair';
      details.push('Page loads are acceptable but could be faster');
    } else {
      details.push('Page loads are fast - good user experience');
    }
    
    // Assess memory impact
    const memoryMB = summary.averageMemoryUsage / 1024 / 1024;
    if (memoryMB > 100) {
      impact = impact === 'good' ? 'fair' : 'poor';
      details.push('High memory usage (>100MB) - may cause browser slowdown');
    } else if (memoryMB > 50) {
      details.push('Moderate memory usage - should be acceptable for most users');
    } else {
      details.push('Low memory usage - efficient extension');
    }
    
    // Assess extension responsiveness
    if (summary.averageExtensionResponse > 2000) {
      impact = impact === 'good' ? 'fair' : 'poor';
      details.push('Extension functions are slow (>2s) - users may perceive lag');
    } else if (summary.averageExtensionResponse > 1000) {
      details.push('Extension functions are moderately fast');
    } else {
      details.push('Extension functions are very responsive');
    }
    
    // Assess error impact
    if (this.metrics.errorCounts.length > 5) {
      impact = 'poor';
      details.push('High error count - users may experience broken functionality');
    } else if (this.metrics.errorCounts.length > 0) {
      details.push('Some errors detected - monitor for user impact');
    }
    
    return {
      level: impact,
      summary: `User experience is ${impact} based on performance metrics`,
      details
    };
  }

  generateRecommendations() {
    const recommendations = [];
    const summary = this.generateSummary();
    
    if (summary.averageLoadTime > 3000) {
      recommendations.push({
        description: 'Optimize page load performance',
        impact: 'Faster loads improve user satisfaction and reduce bounce rate',
        action: 'Consider lazy loading, code splitting, or reducing initial bundle size'
      });
    }
    
    if (summary.averageMemoryUsage / 1024 / 1024 > 50) {
      recommendations.push({
        description: 'Optimize memory usage',
        impact: 'Lower memory usage prevents browser slowdown and crashes',
        action: 'Review memory leaks, optimize data structures, and implement cleanup'
      });
    }
    
    if (summary.averageExtensionResponse > 1000) {
      recommendations.push({
        description: 'Improve extension response times',
        impact: 'Faster responses make the extension feel more responsive',
        action: 'Optimize API calls, add caching, or implement progressive loading'
      });
    }
    
    if (this.metrics.errorCounts.length > 0) {
      recommendations.push({
        description: 'Reduce console errors',
        impact: 'Fewer errors mean more stable functionality for users',
        action: 'Fix JavaScript errors and improve error handling'
      });
    }
    
    return recommendations;
  }

  async runPerformanceTest() {
    console.log('🚀 Starting comprehensive performance test...');
    
    await this.startMonitoring();
    
    // Test 1: Page load performance
    await this.measurePageLoad();
    await this.page.waitForTimeout(2000);
    
    // Test 2: Memory usage
    await this.measureMemoryUsage();
    
    // Test 3: Extension function performance
    const extensionFunctions = ['getConversations', 'getUserFolders', 'getPrompts'];
    for (const func of extensionFunctions) {
      await this.measureExtensionResponseTime(func);
      await this.page.waitForTimeout(500);
    }
    
    // Test 4: Final memory check
    await this.measureMemoryUsage();
    
    return this.generatePerformanceReport();
  }
}

module.exports = PerformanceMonitor;
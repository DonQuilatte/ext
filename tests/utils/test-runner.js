#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class UnifiedTestRunner {
  constructor() {
    this.results = {
      smoke: { status: 'pending', duration: 0, userOutcome: '' },
      functional: { status: 'pending', duration: 0, userOutcome: '' },
      e2e: { status: 'pending', duration: 0, userOutcome: '' },
      overall: { status: 'pending', duration: 0 }
    };
    this.startTime = Date.now();
  }

  async runSuite(suiteName, command) {
    console.log(`\n🚀 Running ${suiteName} Tests...`);
    console.log('='.repeat(50));
    
    const suiteStartTime = Date.now();
    
    try {
      const output = execSync(command, { 
        encoding: 'utf8',
        cwd: process.cwd(),
        stdio: 'inherit' 
      });
      
      const duration = Date.now() - suiteStartTime;
      this.results[suiteName.toLowerCase()] = {
        status: 'passed',
        duration,
        userOutcome: this.getUserOutcome(suiteName, 'passed')
      };
      
      console.log(`✅ ${suiteName} Tests PASSED (${duration}ms)`);
      return true;
      
    } catch (error) {
      const duration = Date.now() - suiteStartTime;
      this.results[suiteName.toLowerCase()] = {
        status: 'failed',
        duration,
        userOutcome: this.getUserOutcome(suiteName, 'failed'),
        error: error.message
      };
      
      console.log(`❌ ${suiteName} Tests FAILED (${duration}ms)`);
      console.log(`Error: ${error.message}`);
      return false;
    }
  }

  getUserOutcome(suiteName, status) {
    const outcomes = {
      smoke: {
        passed: 'Users can access the extension and ChatGPT works normally',
        failed: 'Users may experience basic functionality issues or extension loading problems'
      },
      functional: {
        passed: 'Users can effectively use core features (folders, chats, prompts)',
        failed: 'Users may have difficulty with core functionality or feature access'
      },
      e2e: {
        passed: 'Users can successfully complete real-world tasks using the extension',
        failed: 'Users may struggle with complete workflows or advanced scenarios'
      }
    };
    
    return outcomes[suiteName.toLowerCase()]?.[status] || 'Unknown outcome';
  }

  generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const passedSuites = Object.values(this.results).filter(r => r.status === 'passed').length - 1; // -1 for overall
    const totalSuites = Object.keys(this.results).length - 1; // -1 for overall
    
    this.results.overall = {
      status: passedSuites === totalSuites ? 'passed' : 'partial',
      duration: totalDuration,
      passedSuites,
      totalSuites
    };

    console.log('\n🎯 UNIFIED TEST REPORT');
    console.log('='.repeat(50));
    console.log(`📊 Overall Status: ${this.results.overall.status.toUpperCase()}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`✅ Passed Suites: ${passedSuites}/${totalSuites}`);
    
    console.log('\n📋 USER IMPACT SUMMARY:');
    console.log('-'.repeat(30));
    
    Object.entries(this.results).forEach(([suite, result]) => {
      if (suite === 'overall') return;
      
      const icon = result.status === 'passed' ? '✅' : '❌';
      const statusText = result.status.toUpperCase();
      
      console.log(`${icon} ${suite.charAt(0).toUpperCase() + suite.slice(1)} (${result.duration}ms): ${statusText}`);
      console.log(`   👤 User Impact: ${result.userOutcome}`);
      
      if (result.error) {
        console.log(`   🐛 Error: ${result.error.substring(0, 100)}...`);
      }
      console.log('');
    });
    
    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    console.log('-'.repeat(20));
    
    if (this.results.smoke.status === 'failed') {
      console.log('🔧 CRITICAL: Fix basic functionality issues before proceeding');
      console.log('   - Check extension loading and ChatGPT integration');
      console.log('   - Verify no critical console errors');
    }
    
    if (this.results.functional.status === 'failed') {
      console.log('🔧 HIGH PRIORITY: Core features need attention');
      console.log('   - Review folder, chat, and prompt functionality');
      console.log('   - Check API connectivity and data retrieval');
    }
    
    if (this.results.e2e.status === 'failed') {
      console.log('🔧 MEDIUM PRIORITY: User workflow improvements needed');
      console.log('   - Optimize user experience and feature discoverability');
      console.log('   - Improve performance and error handling');
    }
    
    if (passedSuites === totalSuites) {
      console.log('🎉 EXCELLENT: All tests passed! Extension is ready for users.');
      console.log('💡 Consider adding performance monitoring and user analytics.');
    }
    
    // Save detailed report
    this.saveDetailedReport();
    
    return this.results.overall.status === 'passed';
  }

  saveDetailedReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: this.results,
      userSuccessCriteria: {
        canAccessExtension: this.results.smoke.status === 'passed',
        canUseCoreFeatures: this.results.functional.status === 'passed',
        canCompleteWorkflows: this.results.e2e.status === 'passed'
      },
      recommendations: this.generateRecommendations()
    };
    
    const reportPath = path.join(process.cwd(), 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.smoke.status === 'failed') {
      recommendations.push({
        priority: 'critical',
        category: 'basic_functionality',
        action: 'Fix extension loading and basic integration issues',
        impact: 'Users cannot use the extension at all'
      });
    }
    
    if (this.results.functional.status === 'failed') {
      recommendations.push({
        priority: 'high',
        category: 'core_features',
        action: 'Resolve core functionality problems',
        impact: 'Users cannot access main features effectively'
      });
    }
    
    if (this.results.e2e.status === 'failed') {
      recommendations.push({
        priority: 'medium',
        category: 'user_experience',
        action: 'Improve user workflows and performance',
        impact: 'Users may struggle with complex tasks'
      });
    }
    
    return recommendations;
  }

  async runAllTests() {
    console.log('🎯 ISHKA EXTENSION - UNIFIED TEST RUNNER');
    console.log('==========================================');
    console.log('Testing with real browser automation via Puppeteer');
    console.log('Focus: User outcomes and practical functionality\n');
    
    // Run test suites in order of importance
    const suites = [
      { name: 'Smoke', command: 'npm run test:smoke' },
      { name: 'Functional', command: 'npm run test:functional' },
      { name: 'E2E', command: 'npm run test:e2e' }
    ];
    
    let allPassed = true;
    
    for (const suite of suites) {
      const passed = await this.runSuite(suite.name, suite.command);
      if (!passed) {
        allPassed = false;
        
        // For critical failures, we might want to stop
        if (suite.name === 'Smoke') {
          console.log('\n🚨 CRITICAL: Smoke tests failed. Skipping remaining suites.');
          console.log('   Fix basic functionality before running comprehensive tests.');
          break;
        }
      }
    }
    
    return this.generateReport();
  }
}

// CLI usage
if (require.main === module) {
  const runner = new UnifiedTestRunner();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Unified Test Runner for Ishka Extension

Usage:
  node test-runner.js [options]

Options:
  --help, -h     Show this help message
  --smoke        Run only smoke tests
  --functional   Run only functional tests  
  --e2e          Run only E2E tests
  --all          Run all test suites (default)

Examples:
  node test-runner.js                    # Run all tests
  node test-runner.js --smoke            # Run smoke tests only
  node test-runner.js --functional       # Run functional tests only
  node test-runner.js --e2e              # Run E2E tests only
`);
    process.exit(0);
  }
  
  if (args.includes('--smoke')) {
    runner.runSuite('Smoke', 'npm run test:smoke').then(success => {
      process.exit(success ? 0 : 1);
    });
  } else if (args.includes('--functional')) {
    runner.runSuite('Functional', 'npm run test:functional').then(success => {
      process.exit(success ? 0 : 1);
    });
  } else if (args.includes('--e2e')) {
    runner.runSuite('E2E', 'npm run test:e2e').then(success => {
      process.exit(success ? 0 : 1);
    });
  } else {
    // Run all tests by default
    runner.runAllTests().then(success => {
      process.exit(success ? 0 : 1);
    });
  }
}

module.exports = UnifiedTestRunner;
const { execSync } = require('child_process');
const path = require('path');

/**
 * Jest runner for undefined error detection tests
 * This integrates the undefined error tests into the existing Jest test suite
 */

console.log('🎯 Running undefined error detection tests...');

try {
  // Run the functional menu item tests
  console.log('📋 Running functional menu item tests...');
  execSync('npm test -- tests/functional/menu-item-tests.test.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // Run the E2E tests with undefined error detection
  console.log('📋 Running E2E tests with undefined error detection...');
  execSync('npm test -- tests/e2e/complete-user-workflows.test.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('✅ All undefined error detection tests completed!');
  
} catch (error) {
  console.error('❌ Tests failed:', error.message);
  process.exit(1);
}
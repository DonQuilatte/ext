# Chrome Extension Testing Suite

## Overview

This comprehensive testing suite validates Chrome extensions after premium/subscription cleanup using automated browser testing with Puppeteer.

## Features

- **Full Extension Lifecycle Testing**: Uninstall, reinstall, and validation
- **Premium Code Detection**: Identifies remaining premium-related code
- **Console Monitoring**: Captures all JavaScript errors and warnings
- **UI Element Validation**: Verifies extension components are working
- **Performance Metrics**: Measures extension loading and performance
- **Comprehensive Reporting**: HTML, JSON, and CSV reports
- **Screenshot Capture**: Visual validation of extension state

## Installation

### Prerequisites

- Node.js 16+ 
- Chrome browser
- Extension source code in `./source` directory

### Install Dependencies

```bash
# Install required packages
npm install

# Setup test directories
npm run setup
```

## Usage

### Run Extension Lifecycle Tests

```bash
# Run with browser visible (default)
npm run test:extension

# Run in headless mode
npm run test:extension:headless

# Run in CI environment
npm run test:extension:ci
```

### View Test Results

```bash
# Open HTML report in browser
npm run report

# View JSON report
cat test-results/bug-report.json

# View CSV summary
cat test-results/test-summary.csv
```

## Test Process

### 1. Extension Lifecycle Management
- Simulates extension uninstall/reinstall
- Validates extension reloading
- Verifies extension permissions

### 2. ChatGPT Integration Testing
- Navigates to ChatGPT
- Monitors extension injection
- Captures console messages
- Takes screenshots

### 3. Feature Validation
- **Premium Code Detection**: Scans for payment/subscription references
- **UI Element Verification**: Checks extension components
- **Functionality Testing**: Validates core features
- **Error Monitoring**: Captures JavaScript errors

### 4. Report Generation
- **HTML Report**: Visual dashboard with metrics
- **JSON Report**: Detailed test data
- **CSV Report**: Tabular summary
- **Screenshots**: Visual validation

## Configuration

### Environment Variables

```bash
# Run in headless mode
HEADLESS=true npm run test:extension

# Enable debug logging
DEBUG=true npm run test:extension

# Custom timeout (milliseconds)
TEST_TIMEOUT=180000 npm run test:extension
```

### Test Configuration

Edit `tests/setup.js` to customize:

```javascript
global.extensionLifecycleConfig = {
  extensionPath: path.join(__dirname, '../source'),
  headless: process.env.HEADLESS === 'true',
  timeout: {
    page: 30000,
    element: 10000,
    navigation: 60000
  }
};
```

## Test Results

### Health Score Calculation

- **Excellent (80-100%)**: All tests pass, minimal issues
- **Good (60-79%)**: Minor issues, generally functional
- **Poor (0-59%)**: Major issues requiring attention

### Report Sections

1. **Summary Dashboard**
   - Health score
   - Pass/fail counts
   - Critical error count
   - Premium issue count

2. **Test Results Table**
   - Individual test status
   - Detailed results
   - Error information

3. **Recommendations**
   - Prioritized action items
   - Severity levels (Critical, High, Medium, Info)
   - Specific remediation steps

4. **Console Messages**
   - JavaScript errors
   - Warning messages
   - Debug information

5. **Extension Analysis**
   - Manifest validation
   - File analysis
   - Suspicious pattern detection

## Troubleshooting

### Common Issues

#### Extension Not Loading
```bash
# Check extension path
ls -la source/manifest.json

# Verify permissions
cat source/manifest.json | grep -i permissions
```

#### Test Timeouts
```bash
# Increase timeout
TEST_TIMEOUT=300000 npm run test:extension
```

#### Browser Issues
```bash
# Clear browser data
rm -rf ~/.config/google-chrome/Default/Extensions

# Run in headless mode
HEADLESS=true npm run test:extension
```

### Debug Mode

Enable detailed logging:

```javascript
// In test file
console.log('Debug info:', debugData);

// Environment variable
DEBUG=true npm run test:extension
```

## Expected Test Results

### ✅ Successful Tests Should Show:
- Extension loads without errors
- No premium-related console messages
- UI elements present and functional
- Health score > 80%
- No critical errors

### ❌ Failed Tests May Indicate:
- Premium code still present
- JavaScript errors in extension
- Missing UI components
- Performance issues
- Manifest problems

## File Structure

```
tests/
├── extension-lifecycle-test.js    # Main test suite
├── setup.js                       # Test configuration
└── README-EXTENSION-TESTING.md    # This file

test-results/
├── bug-report.html               # Visual report
├── bug-report.json               # Raw test data
└── test-summary.csv              # Tabular summary

screenshots/
└── chatgpt-loaded.png            # Visual validation
```

## Contributing

### Adding New Tests

1. Create test in `tests/extension-lifecycle-test.js`
2. Add validation logic
3. Update report generation
4. Document expected behavior

### Extending Reports

1. Modify `generateHTMLReport()` method
2. Add new data to test results
3. Update CSS styling
4. Test report generation

## Support

For issues or questions:

1. Check console logs in test output
2. Review `test-results/bug-report.html`
3. Verify extension source code
4. Check browser compatibility

## License

This testing suite is provided as-is for Chrome extension validation purposes.
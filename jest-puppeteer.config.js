module.exports = {
  launch: {
    headless: process.env.CI ? 'new' : false, // Show browser in development
    slowMo: process.env.CI ? 0 : 50, // Slow down in development for debugging
    devtools: !process.env.CI, // Open devtools in development
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      // Load the extension
      `--load-extension=${__dirname}/source`,
      '--disable-extensions-except=${__dirname}/source',
      // Additional Chrome flags for extension testing
      '--allow-running-insecure-content',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  },
  browserContext: 'default'
};
module.exports = {
  launch: {
    headless: process.env.CI ? 'new' : false,
    slowMo: process.env.CI ? 0 : 50,
    devtools: !process.env.CI,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--allow-running-insecure-content',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--ignore-ssl-errors=true',
      '--ignore-certificate-errors',
      '--disable-blink-features=AutomationControlled',
      '--disable-extensions-file-access-check',
      // Extension-specific flags
      `--load-extension=${__dirname}/source`,
      `--disable-extensions-except=${__dirname}/source`,
      // Allow extension to access file URLs
      '--allow-file-access-from-files',
      '--enable-local-file-accesses'
    ],
    timeout: 60000
  },
  browserContext: 'default',
};
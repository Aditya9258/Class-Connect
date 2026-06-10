import puppeteer from 'puppeteer';

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('BROWSER ERROR:', msg.text());
      }
    });

    page.on('pageerror', error => {
      console.error('PAGE ERROR:', error.message);
    });

    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });

    console.log('Page loaded. Checking for React root...');
    const rootHtml = await page.$eval('#root', el => el.innerHTML);
    if (!rootHtml) {
      console.log("Root is empty! There must have been an error.");
    } else {
      console.log("Root has content. Length:", rootHtml.length);
    }

    await browser.close();
  } catch (err) {
    console.error("Script failed:", err);
  }
})();

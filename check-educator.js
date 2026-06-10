import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));

    console.log('Navigating to /educator...');
    await page.goto('http://localhost:3000/educator', { waitUntil: 'networkidle0', timeout: 15000 });

    const rootLen = await page.$eval('#root', el => el.innerHTML.length);
    console.log('Root content length:', rootLen);

    const h1 = await page.$eval('h1', el => el.textContent);
    console.log('Page title (h1):', h1);

    const cardCount = await page.$$eval('.group.cursor-pointer', els => els.length);
    console.log('Educator cards found:', cardCount);

    // Click the first card and check modal appears
    const firstCard = await page.$('.group.cursor-pointer');
    if (firstCard) {
      await firstCard.click();
      await page.waitForSelector('[class*="fixed inset-0"]', { timeout: 3000 });
      const modalName = await page.$eval('[class*="fixed inset-0"] h2', el => el.textContent);
      console.log('Modal opened for:', modalName);
    }

    const pageErrors = errors.filter(e => e.startsWith('PAGE_ERROR'));
    if (pageErrors.length) {
      console.log('Page errors:', pageErrors.join('\n'));
    } else {
      console.log('No page errors!');
    }

    await browser.close();
  } catch (err) {
    console.error('Script failed:', err);
  }
})();

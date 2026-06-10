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

    console.log('Navigating to /contact...');
    await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle0', timeout: 15000 });

    const rootLen = await page.$eval('#root', el => el.innerHTML.length);
    console.log('Root content length:', rootLen);

    const h1 = await page.$eval('h1', el => el.textContent);
    console.log('Page title (h1):', h1.replace(/\s+/g, ' ').trim());

    // Check Info Cards
    const cards = await page.$$eval('.lucide-mail', els => els.length);
    console.log('Mail icon found:', cards > 0);

    // Check Form
    const inputs = await page.$$eval('input', els => els.length);
    const textareas = await page.$$eval('textarea', els => els.length);
    console.log(`Form fields found: ${inputs} inputs, ${textareas} textareas`);

    // Check FAQ
    const faqButtons = await page.$$('button:has(h3)');
    console.log('FAQ questions found:', faqButtons.length);
    if (faqButtons.length > 0) {
      // Click second FAQ to test interaction
      await faqButtons[1].click();
      await new Promise(r => setTimeout(r, 500)); // Wait for GSAP animation
      const secondAnswerText = await page.evaluate(el => el.nextElementSibling.textContent, faqButtons[1]);
      console.log('Second FAQ expanded text length:', secondAnswerText.length);
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

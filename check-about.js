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

    console.log('Navigating to /about...');
    await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0', timeout: 15000 });

    const rootLen = await page.$eval('#root', el => el.innerHTML.length);
    console.log('Root content length:', rootLen);

    const h1 = await page.$eval('h1', el => el.textContent);
    console.log('Page title (h1):', h1.replace(/\s+/g, ' ').trim());

    // Verify sections exist by checking section headers
    const sectionHeaders = await page.$$eval('.section-header h2', els => els.map(e => e.textContent));
    console.log('Found Sections:', sectionHeaders.join(', '));

    // Verify specific elements
    const valuesCount = await page.$$eval('.value-card', els => els.length);
    console.log('Values cards found:', valuesCount);

    const timelineCount = await page.$$eval('.timeline-item', els => els.length);
    console.log('Timeline items found:', timelineCount);

    const testimonialExists = await page.$$eval('.testi-card', els => els.length > 0);
    console.log('Testimonial card exists:', testimonialExists);

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

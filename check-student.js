import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    console.log('Navigating to /student...');
    await page.goto('http://localhost:3000/student', { waitUntil: 'networkidle0', timeout: 15000 });

    const rootLen = await page.$eval('#root', el => el.innerHTML.length);
    console.log('Root content length:', rootLen);

    const h1 = await page.$eval('h1', el => el.textContent);
    console.log('Page title (h1):', h1);

    const cardIds = await page.$$eval('[id]', els =>
      els.map(e => e.id).filter(id =>
        ['grades-main','grades-tests','performance','attendance','timetable','competitive','heatmaps','announcements','fees'].includes(id)
      )
    );
    console.log('Dashboard cards found:', cardIds.length, '-', cardIds.join(', '));

    if (errors.length) {
      console.log('Browser errors:', errors.join('\n'));
    } else {
      console.log('No browser errors!');
    }

    await browser.close();
  } catch (err) {
    console.error('Script failed:', err);
  }
})();

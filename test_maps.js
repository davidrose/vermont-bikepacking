import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQ FAIL:', request.url(), request.failure().errorText));

  const uri = 'file://' + path.resolve('index.html');
  await page.goto(uri, { waitUntil: 'networkidle0' });
  
  // scroll down to trigger intersection observer
  await page.evaluate(() => {
    window.scrollBy(0, document.body.scrollHeight);
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();

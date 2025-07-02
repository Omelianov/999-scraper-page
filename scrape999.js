const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();

  const listings = [];

  for (let pageNum = 1; pageNum <= 2; pageNum++) { // Сколько страниц нужно собрать
    console.log(`📄 Сбор данных с страницы ${pageNum}...`);
    await page.goto(`https://999.md/ru/list/real-estate/apartments-and-rooms/sell?page=${pageNum}`, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000); // для надёжности

    const data = await page.evaluate(() => {
      const items = document.querySelectorAll('.ads-list-photo-item');
      const pageData = [];

      items.forEach(item => {
        const titleEl = item.querySelector('.ads-list-photo-item-title');
        const priceEl = item.querySelector('.ads-list-photo-item-price');
        const locationEl = item.querySelector('.ads-list-photo-item-location');
        const linkEl = item.querySelector('a');

        if (titleEl && priceEl && linkEl) {
          const title = titleEl.innerText.trim();
          const price = priceEl.innerText.trim();
          const location = locationEl ? locationEl.innerText.trim() : 'Нет данных';
          const link = linkEl.href;

          pageData.push({ title, price, location, link });
        }
      });
      return pageData;
    });

    listings.push(...data);
  }

  fs.writeFileSync('data.json', JSON.stringify(listings, null, 2), 'utf-8');
  console.log(`✅ Данные успешно сохранены в data.json (${listings.length} объектов)`);

  await browser.close();
})();

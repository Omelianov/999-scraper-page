const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://999.md/ru/list/real-estate/apartments-and-rooms/sell', { waitUntil: 'domcontentloaded' });

  const listings = await page.evaluate(() => {
    const items = document.querySelectorAll('.ads-list-photo-item');
    const data = [];

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

        data.push({ title, price, location, link });
      }
    });

    return data;
  });

  console.log(listings); // проверка, вывод данных в консоль

  fs.writeFileSync('data.json', JSON.stringify(listings, null, 2), 'utf-8');

  console.log('✅ Данные успешно сохранены в data.json');
  await browser.close();
})();

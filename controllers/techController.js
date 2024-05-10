const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

async function crawlTechEvents() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://dev.events/tech');

    // Số lần lặp để cuộn trang web
    const numberOfScrolls = 1000;
    const scrollSelector = 'div.row.columns.is-mobile:last-child';
 // Cuộn xuống dưới cùng của trang theo số lần lặp
    for (let i = 0; i < numberOfScrolls; i++) {
       
        await page.evaluate((scrollSelector) => {
            document.querySelector(scrollSelector).scrollIntoView();
        }, scrollSelector);
        await page.waitForSelector(scrollSelector);
    }

    // Lấy HTML đã render của trang web
    const html = await page.content();
    await browser.close();

    // Load HTML vào Cheerio
    const $ = cheerio.load(html);

    // Mảng chứa toàn bộ dữ liệu sự kiện
    const events = [];

    // Lặp qua mỗi phần tử chứa thông tin sự kiện
    $('div.row.columns.is-mobile').each((index, element) => {
        // Đối tượng chứa thông tin sự kiện
        const event = {};

        // Lấy thông tin từ script JSON-LD
        const jsonLD = $(element).find('script[type="application/ld+json"]').html();
        if (jsonLD) {
            const eventData = JSON.parse(jsonLD);
            event.name = eventData.name || '';
            event.startDate = eventData.startDate || '';
            event.endDate = eventData.endDate || '';
            event.description = eventData.description || '';
            event.url = eventData.url || '';
        }

        // Lấy thông tin từ thẻ h2
        event.title = $(element).find('.title.is-5.is-size-6-mobile a').text().trim();

        // Lấy thông tin từ thẻ h3
        event.subtitle = $(element).find('.subtitle.is-6.is-size-7-mobile').text().trim();

        // Lấy thông tin từ thẻ time
        event.time = $(element).find('.column.is-one-quarter time').text().trim();

        // Thêm sự kiện vào mảng events
        events.push(event);
    });

    // Chuyển đổi mảng events thành chuỗi JSON và xuất ra file
    const jsonData = JSON.stringify(events, null, 2);
    fs.writeFileSync('./data/tech_events.json', jsonData);
    console.log('Data has been saved to tech_events.json');
}

// Gọi hàm crawl khi khởi chạy
module.exports = crawlTechEvents();

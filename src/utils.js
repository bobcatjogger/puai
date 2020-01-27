require('dotenv').config();
const puppeteer = require('puppeteer');

module.exports.startBrowser = async function (settings) {
    const browser = await puppeteer.launch({ headless:settings.isHeadless });
    const page = await browser.newPage();
    await page.setViewport(settings.viewport);
    settings.connection = browser.wsEndpoint();
    console.log(`Connection1: ${settings.connection}`);
    return {browser: browser, page: page};
};

module.exports.closeBrowser = async function (browser) {
    return browser.close();
};

module.exports.connectBrowser = async function (settings) {
    console.log(`Attempt to reconnect to connection: ${settings.connection}`);
    return puppeteer.connect({
        'browserWSEndpoint': settings.connection,
        'defaultViewport': settings.viewport
    });
};

module.exports.getRandomDelay = function (min = 1313, max = 7137) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};



// find the link, by going over all links on the page
async function findByLink(page, linkString) {
    const links = await page.$$('a');
    for (var i=0; i < links.length; i++) {
        let valueHandle = await links[i].getProperty('innerText');
        let linkText = await valueHandle.jsonValue();
        const text = getText(linkText);
        if (linkString === text) {
            console.log(linkString);
            console.log(text);
            console.log("Found");
            return links[i];
        }
    }
    return null;
}
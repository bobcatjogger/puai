require('dotenv').config();
const util = require('./utils');

const isHeadless = false;
const loginUrl = 'https://hub.prosperousuniverse.com/login';
const apexUrl = 'https://apex.prosperousuniverse.com';
const emailAddress = process.env.EMAIL ? process.env.EMAIL : 'missing .env file or file is empty :(';
const puPass = process.env.PASS ? process.env.PASS : 'password goes here';

async function startBrowser(isHeadless) {
  const browser = await puppeteer.launch({ headless:isHeadless });
  const page = await browser.newPage();
  return {browser, page};
}

async function closeBrowser(browser) {
  return browser.close();
}

// find the link, by going over all links on the page
async function findByLink(page, linkString) {
  const links = await page.$$('a')
  for (var i=0; i < links.length; i++) {
    let valueHandle = await links[i].getProperty('innerText');
    let linkText = await valueHandle.jsonValue();
    const text = getText(linkText);
    if (linkString == text) {
      console.log(linkString);
      console.log(text);
      console.log("Found");
      return links[i];
    }
  }
  return null;
}




console.log('Starting');

Apify.main(async () => {
  // Open a named dataset
  const dataset = await Apify.openDataset('puai');
  
  // Launch the browser and navigate to the page
  const browser = await Apify.launchPuppeteer({ headless:isHeadless });
  const page = await browser.newPage();
  await page.goto(loginUrl, { waitUntil: 'networkidle2' });
  const emailInput = await page.waitFor('#login')
    .then( loginUrl => console.log('Arrived at: ', loginUrl));
  
  // Login
  await emailInput.type(emailAddress)
    .then(emailAddress => console.log('Entered Email Address: ', emailAddress));

  await page.type('#password', puPass)
    .then(puPass => console.log('Entered Password (first 4): ', puPass.slice(0, 4)));

  await page.click('button.btn', {delay: util.getRandomDelay()})
    .then(console.log('Clicked the login button.'));

  // Open APEX
  await page.goto(apexUrl, {waitUntil: 'networkidle2'});
  console.log('Arrived at: ', apexUrl);

  // Find and select the scrns drop down
  const SCRNS = await page.waitFor('ScreenControls__screens___27UzSLh');

  // scrape the Construction Prefabs from CX NC1 (NEO - Montem)
  await page.select('#ActionBar__element___2ELn_Cx', 'ef423f673d9e8c82043b4c5c63f6b55e')
  const conPrefabs = await page.evaluate('.ef423f673d9e8c82043b4c5c63f6b55e')

  // Holds the browser until we terminate the process explicitly
  await browser.waitForTarget(() => false, {timeout: 999999});

  // wrap it up
  await browser.close();
  console.log('Fin.');
});


async function marketScrape(connection) {
  const {browser, page} = await startBrowser(connection);
  page.setViewport({width: 1366, height: 768});

  await page.goto(url);
  await findByLink(page, "Lets Check It Out");
  
  await closeBrowser(browser);
}

(async () => {
  const connection = 'foobar';
  await marketScrape(connection);
  process.exit(1);
})();

// const getProductNameFromSelector = async el =>
//   el
//     .evaluate(el =>  //HERE
//       [].reduce.call(
//         el.childNodes,
//         (a, b) =>
//           a +
//           (b.nodeType === 3
//             ? b.textContent
//                 .replace(/[\r\n]+/gm, "")
//                 .replace(/\s+/g, " ")
//                 .trim()
//             : ""),
//         ""
//       )
//     )
//     .then(result => result)
//     .catch(err => console.log("error in function", err, el));
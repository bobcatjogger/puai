require('dotenv').config();
const Apify = require('apify');
const util = require('./utils');

const isHeadless = false;
const loginUrl = 'https://hub.prosperousuniverse.com/login';
const apexUrl = 'https://apex.prosperousuniverse.com';
const emailAddress = process.env.EMAIL ? process.env.EMAIL : 'missing .env file or file is empty :(';
const puPass = process.env.PASS ? process.env.PASS : 'password goes here';

console.log('Starting');

Apify.main(async () => {
  // Open a named dataset
  const dataset = await Apify.openDataset('puai');
  
  // Launch the browser and navigate to the page
  const browser = await Apify.launchPuppeteer({ headless:isHeadless });
  const page = await browser.newPage();
  await page.goto(loginUrl, { waitUntil: 'networkidle2' });
  const emailInput = await page.waitFor('#login');
  console.log('Arrived at: ', loginUrl);
  
  // Login
  await emailInput.type(emailAddress);
  console.log('Entered Email Address: ', emailAddress);

  await page.type('#password', puPass);
  console.log('Entered Password (first 4): ', puPass ? puPass.slice(0, 4) : puPass);  // undefined safe

  await page.click('button.btn', {delay: util.getRandomDelay()});
  console.log('Clicked the login button.');

  // Open APEX
  await page.goto(apexUrl, {waitUntil: 'networkidle2'});
  const SCRNS = await page.waitFor('ul.ScreenControls__screens___27UzSLh');
  console.log('Arrived at: ', apexUrl);

  // Switch to the PUAI screen
  if (SCRNS.length > 0){
    SCRNS.forEach(scn => console.log(scn));
  }

  // Holds the browser until we terminate the process explicitly
  await browser.waitForTarget(() => false, {timeout: 999999});

  // scrape the Construction Prefabs from CX NC1 (NEO - Montem)
  //<option value="ef423f673d9e8c82043b4c5c63f6b55e

  // wrap it up
  await browser.close();
  console.log('Fin.');
});


// const puppeteer = require('puppeteer');
//
// // Boilerplate stuff
// async function startBrowser() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   return {browser, page};
// }
//
// async function closeBrowser(browser) {
//   return browser.close();
// }
//
// // Normalizing the text
// function getText(linkText) {
//   linkText = linkText.replace(/\r\n|\r/g, "\n");
//   linkText = linkText.replace(/\ +/g, " ");
//
//   // Replace &nbsp; with a space
//   var nbspPattern = new RegExp(String.fromCharCode(160), "g");
//   return linkText.replace(nbspPattern, " ");
// }
//
// // find the link, by going over all links on the page
// async function findByLink(page, linkString) {
//   const links = await page.$$('a')
//   for (var i=0; i < links.length; i++) {
//     let valueHandle = await links[i].getProperty('innerText');
//     let linkText = await valueHandle.jsonValue();
//     const text = getText(linkText);
//     if (linkString == text) {
//       console.log(linkString);
//       console.log(text);
//       console.log("Found");
//       return links[i];
//     }
//   }
//   return null;
// }
//
// async function playTest(url) {
//   const {browser, page} = await startBrowser();
//   page.setViewport({width: 1366, height: 768});
//   await page.goto(url);
//   await findByLink(page, "Lets Check It Out");
//   await page.screenshot({path: 'screenshot.png'});
//   await closeBrowser(browser);
// }
//
// (async () => {
//   await playTest("https://browsee.io/");
//   process.exit(1);
// })();
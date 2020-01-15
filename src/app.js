require('dotenv').config();
const Apify = require('apify');

const isHeadless = false;
const loginUrl = 'https://hub.prosperousuniverse.com/login';
const apexUrl = 'https://apex.prosperousuniverse.com';
const emailAddress = process.env.EMAIL ? process.env.EMAIL : 'missing@email.com';
const puPass = process.env.PASS ? process.env.PASS : 'soopersecretpassword';

function getRandomDelay(min = 131, max = 7137) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

  await page.click('button.btn', {delay: getRandomDelay()});
  console.log('Clicked the login button.');

  // Open APEX
  await page.goto(apexUrl), {waitUntil: 'networkidle2', delay: getRandomDelay()};
  console.log('Arrived at: ', apexUrl);

  // Ensure the PUAI screen is ready for us
  // const puaiScreen = await page.waitFor('#ScreenControls__currentScreenName___1T_7EzU');

  // await puaiScreen.hover();

  // console.log(puaiScreen);
  
  // .then(() => console.log(puaiScreen.evaluate(node => node.innerText))
    // );
  

  // Holds the browser until we terminate the process explicitly
  await browser.waitForTarget(() => false, {timeout: 999999});

  // scrape the Construction Prefabs from CX NC1 (NEO - Montem)
  //<option value="ef423f673d9e8c82043b4c5c63f6b55e

  // wrap it up
  await browser.close();
  console.log('Fin.');
})

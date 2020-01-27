require('dotenv').config();
const util = require('./utils');
const readline = require('readline');
const moment = require('moment');

//   await page.goto(loginUrl, { waitUntil: 'networkidle2' });
//   const emailInput = await page.waitFor('#login')
//     .then( loginUrl => console.log('Arrived at: ', loginUrl));
  
//   // Login
//   await emailInput.type(emailAddress)
//     .then(emailAddress => console.log('Entered Email Address: ', emailAddress));

//   await page.type('#password', puPass)
//     .then(puPass => console.log('Entered Password (first 4): ', puPass.slice(0, 4)));

//   await page.click('button.btn', {delay: util.getRandomDelay()})
//     .then(console.log('Clicked the login button.'));

//   // Open APEX
//   await page.goto(apexUrl, {waitUntil: 'networkidle2'});
//   console.log('Arrived at: ', apexUrl);

//   // Find and select the scrns drop down
//   const SCRNS = await page.waitFor('ScreenControls__screens___27UzSLh');

//   // scrape the Construction Prefabs from CX NC1 (NEO - Montem)
//   await page.select('#ActionBar__element___2ELn_Cx', 'ef423f673d9e8c82043b4c5c63f6b55e')
//   const conPrefabs = await page.evaluate('.ef423f673d9e8c82043b4c5c63f6b55e')

//   // Holds the browser until we terminate the process explicitly
//   await browser.waitForTarget(() => false, {timeout: 999999});

//   // wrap it up
//   await browser.close();
//   console.log('Fin.');
// });

async function askQuestion(query) {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
  }))
}

// Main entry point
const start = async function() {
  console.log(`*** Starting at ${moment().format()} ***`);

  // build the settings PoJSO
  const settings = {
    'connection': null,
    'isHeadless': false,
    'loginUrl': 'https://hub.prosperousuniverse.com/login',
    'apedUrl': 'https://apex.prosperousuniverse.com',
    'emailAddress': process.env.EMAIL ? process.env.EMAIL : 'missing .env file or file is empty :(',
    'puPass': process.env.PASS ? process.env.PASS : 'password goes here',
    'width': 1920,
    'height': 1080    
  };
  settings.viewport = {'width': settings.width, 'height': settings.height};
  
  // start the party
  {
    let pup = {browser: null, page: null};
    let iWannaLoop = true;
    do {
      let ans = await askQuestion(`[${moment().format()}] | Enter command :  `);

      switch (ans.toLowerCase()) {
        case 'h' || 'help':
          console.log(`[${moment().format()}] | Help requested.`);
          console.log(`Command list\nh - help\nq - quit\n1 - start browser`);
          break;

        case 'q':
          console.log(`[${moment().format()}] | Quitting. Bye.`);
          iWannaLoop = false;
          break;

        case '1':
          console.log(`[${moment().format()}] | Start Browser Selected.`);
          pup = await util.startBrowser(settings);
          break;

        case '2':
          console.log(`[${moment().format()}] | Login Selected.`);

          if (!pup.page) {
            console.log(`[${moment().format()}] | Page is undefined - start or connect to a browser before logging in.`);
            break;
          }
          await pup.page.goto(settings.loginUrl, {waitUntil: 'networkidle2'});
          const emailInput = await pup.page.waitFor('#login')
              .then(() => console.log(`[${moment().format()}] | Arrived at: ${settings.loginUrl}`));

          // Login
          await emailInput.type(settings.emailAddress)
              .then(emailAddress => console.log(`[${moment().format()}] | Entered email: ${emailAddress}`));

          await pup.page.type('#password', settings.puPass)
              .then(puPass => console.log(`[${moment().format()}] | Entered Password (first 4): ${puPass.slice(0, 4)}`));

          await pup.page.click('button.btn', {delay: util.getRandomDelay()})
              .then(() => console.log('Clicked the login button.'));
          break;

        default:
          console.log(`[${moment().format()}] | Unknown command. Try 'h' for help with commands.`);
          break;
      }
    } while (iWannaLoop);
  }
  // await marketScrape();
  process.exit();
};

start().then(r => console.log(`Result: ${r}`));



async function helloWorld(settings) {
  if (settings.connection) {
    const browser = await connectBrowser(settings);
  }
  else{
    const {browser, page} = await startBrowser(settings);
  }

  console.log(`Connection2: ${settings.connection}`);


  await page.goto(settings.loginUrl);
  // await findByLink(page, "Lets Check It Out");
  setTimeout(function() {
    console.log('Zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
  }, 999999);
  await closeBrowser(browser);
}

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
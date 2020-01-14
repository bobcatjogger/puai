const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const url = 'https://apex.prosperousuniverse.com/login';

puppeteer
      .launch()
      .then(browser => browser.newPage())
      .then(page => {
        return page.goto(url).then(function() {
          return page.content();
        });
      })
      .then(html => {
        const $ = cheerio.load(html);
        console.log($);
        const loginPage = $('.login-page');
        console.log(loginPage);
      })
      .catch(console.error);

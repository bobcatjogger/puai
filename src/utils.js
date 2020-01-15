require('dotenv').config();
const Apify = require('apify');

const isHeadless = false;
const loginUrl = 'https://hub.prosperousuniverse.com/login';
const apexUrl = 'https://apex.prosperousuniverse.com';
const emailAddress = process.env.EMAIL ? process.env.EMAIL : 'missing .env file or file is empty :(';
const puPass = process.env.PASS ? process.env.PASS : 'password goes here';

module.exports.getRandomDelay = function (min = 1313, max = 7137) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
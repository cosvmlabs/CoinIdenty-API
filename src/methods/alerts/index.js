const moment = require('moment');

const listing = require('./listing');
const news = require('./news');
const fearAndGreed = require('./fearAndGreed');
const whale = require('./whale');
const gas = require('./gas');
const markets = require('./markets');

module.exports = async () => {
  const now = moment();
  const hour = Number(now.hours());
  const minute = Number(now.minutes());

  let alerted = await listing() || await news();
  alerted = alerted || (hour % 12 === 0 && minute === 4 && await fearAndGreed());
  alerted = alerted || (minute % 4 === 0 && await whale());
  alerted = alerted || (hour % 2 === 0 && minute === 0 && await gas());
  alerted = alerted || (minute % 15 === 0 && await markets());
  return alerted;
};
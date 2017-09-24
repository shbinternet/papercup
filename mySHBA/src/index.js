'use strict';

// External imports
const Alexa = require('alexa-sdk');

// Local imports
const ExchangeHandlers = require('./ExchangeHandlers')
const AcnoHandlers = require('./AcnoHandlers')

// Constants
const APP_ID = "amzn1.ask.skill.daeb2816-8d08-41eb-953a-e5ca9eb2feef"; // This value would be your Skill ID. You can find this on https://developer.amazon.com/

exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context);

    alexa.appId = APP_ID;
    alexa.registerHandlers(ExchangeHandlers);

    console.log(`Beginning execution for skill with APP_ID=${alexa.appId}`);
    alexa.execute();
    console.log(`Ending execution  for skill with APP_ID=${alexa.appId}`);
};
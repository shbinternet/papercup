'use strict';

/**
 * This class contains all handler function about Exchange Rate definitions
 * for the various events that we will be registering for.
 * ExchangeRate,  ExchangeRate_cur, ExchangeRate_date, ExchangeRate_mix
 */

// Internal imports
const AlexaAPIClient = require('./AlexaAPIClient');
const Intents = require('./Intents');
const Events = require('./Events');
const Messages = require('./Messages');

/**
 * Another Possible value if you only want permissions for the country and postal code is:
 * read::alexa:device:all:address:country_and_postal_code
 * Be sure to check your permissions settings for your skill on https://developer.amazon.com/
//  */
// const ALL_ADDRESS_PERMISSION = "read::alexa:device:all:address";

// const PERMISSIONS = [ALL_ADDRESS_PERMISSION];

/**
 * This is the handler for the NewSession event.
 * Refer to the  Events.js file for more documentation.
 */
const newSessionRequestHandler = function() {
    console.info("Starting newSessionRequestHandler()");

    if(this.event.request.type === Events.LAUNCH_REQUEST) {
        console.log(">>>>>>Events.LAUNCH_REQUEST ");
        this.emit(Events.LAUNCH_REQUEST);
    } else if (this.event.request.type === "IntentRequest") {
        console.log(">>>>>>IntentRequest "+ this.event.request.intent.name);
        this.emit(this.event.request.intent.name);
        console.log(">>>>>>>>>handlers " + handlers)
    }
    console.info("Ending newSessionRequestHandler()");
};




/**
 * Sent when the user invokes your skill without providing a specific intent.
 * This is the handler for the LaunchRequest event. Refer to
 * the Events.js file for more documentation.
 */
const launchRequestHandler = function() {
    console.info("Starting launchRequestHandler()");
    this.emit(':askWithCard', Messages.WELCOME + Messages.WHAT_DO_YOU_WANT, Messages.WHAT_DO_YOU_WANT, Messages.WELCOME , Messages.WHAT_DO_YOU_WANT, Messages.SHINHAN_LOGO);

    console.info("Ending launchRequestHandler()");
};

/**
 * This is the handler for our custom Exchangerate intent.
 * Refer to the Intents.js file for documentation.
 */

const getExchangeRateHandler = function() {
    console.info("Starting getExchangeRateHandler()");

    var date='';
    var currency='KRW';
    var amount ='1.0';
    var currencySlot = this.event.request.intent.slots.CURRENCY;
    var dateSlot = this.event.request.intent.slots.DATE;
    var amountSlot = this.event.request.intent.slots.AMOUNT;        

    if(currencySlot != undefined) var currencyValue = currencySlot.value;
    if(dateSlot != undefined) var dateValue = dateSlot.value;
    if(amountSlot != undefined) var amountValue = amountSlot.value; 

    if(currencyValue != undefined) currency = currencyValue.toUpperCase();
    if(dateValue != undefined) date=dateValue.replace(/-/g,'');
    if(amountValue != undefined) amount=amountValue;

    console.log(">>>>>>currency " + currency + ">>>date" + date + ">>>amount "+amount );

    const path='/global_api/exchangerate';
    const personalKey='';
    const AlexaAPIClient = new AlexaAPIClient(path, personalKey);
    console.log("new AlexaAPIClient")
    let apiRequest = AlexaAPIClient.getCurrencyRate(currency, date);

    apiRequest.then((response) => {
        switch(response.statusCode) {
            case 200:
                console.log("Address successfully retrieved, now responding to user.");
                var length=response.data.length;
                var speakOut;
                if(length==0){
                    speakOutMessage = Messages.NO_CURRENCYRATE;
                }else{ 
                    var date =response.ntfct_dt;
                    var speakOutMessage="As for " + date + ", \n";
                    for(var i=0 ; i<length; i++){
                        var ccy_c = response.data[i].ccy_c;
                        if(currency == ccy_c){  //matched
                            var rate = response.data[i].pos_sel_cent_rt;
                            speakOutMessage += "USD to " + ccy_c + " is " + rate + ".\n";
                            if(amount != "1.0"){
                                var convert = amount * ccy_c;
                                speakOutMessage += amount + " US dollar is " + convert + ccy_c + ".\n";
                            }
                        }else{ //not matched
                            speakOutMessage = Messages.NO_CURRENCYRATE;
                        }                        
                    } 
                    speakOutMessage += Messages.CURRENCY_AVAILABLE + speakOutMessage ;          
                } 

                this.emit(":tell", speakOutMessage);
                break;
            case 204:
                // This likely means that the user didn't have their address set via the companion app.
                console.log("Successfully requested from the device address API, but no rate was returned.");
                this.emit(":tell", Messages.NO_CURRENCYRATE);
                break;
            default:
                this.emit(":ask", Messages.APICALL_FAILURE, Messages.APICALL_FAILURE);
        }

        console.info("Ending getExchangeRateHandler()");
    });

    apiRequest.catch((error) => {
        this.emit(":tell", Messages.ERROR);
        console.error(error);
        console.info("Ending getAddressHandler()");
    });
};
/**
 * This is the handler for the SessionEnded event. Refer to
 * the Events.js file for more documentation.
 */
const sessionEndedRequestHandler = function() {
    console.info("Starting sessionEndedRequestHandler()");
    this.emit(":tell", Messages.GOODBYE);
    console.info("Ending sessionEndedRequestHandler()");
};

/**
 * This is the handler for the Unhandled event. Refer to
 * the Events.js file for more documentation.
 */
const unhandledRequestHandler = function() {
    console.info("Starting unhandledRequestHandler()");
    this.emit(":ask", Messages.UNHANDLED, Messages.UNHANDLED);
    console.info("Ending unhandledRequestHandler()");
};

/**
 * This is the handler for the Amazon help built in intent.
 * Refer to the Intents.js file for documentation.
 */
const amazonHelpHandler = function() {
    console.info("Starting amazonHelpHandler()");
    this.emit(":ask", Messages.HELP, Messages.HELP);
    console.info("Ending amazonHelpHandler()");
};

/**
 * This is the handler for the Amazon cancel built in intent.
 * Refer to the Intents.js file for documentation.
 */
const amazonCancelHandler = function() {
    console.info("Starting amazonCancelHandler()");
    this.emit(":tell", Messages.GOODBYE);
    console.info("Ending amazonCancelHandler()");
};

/**
 * This is the handler for the Amazon stop built in intent.
 * Refer to the Intents.js file for documentation.
 */
const amazonStopHandler = function() {
    console.info("Starting amazonStopHandler()");
    this.emit(":ask", Messages.STOP, Messages.STOP);
    console.info("Ending amazonStopHandler()");
};


const handlers = {};

// Add event handlers
handlers[Events.NEW_SESSION] = newSessionRequestHandler;
handlers[Events.LAUNCH_REQUEST] = launchRequestHandler;
handlers[Events.SESSION_ENDED] = sessionEndedRequestHandler;
handlers[Events.UNHANDLED] = unhandledRequestHandler;

// Add intent handlers
handlers[Intents.EXCHANGERATE] = getExchangeRateHandler;
handlers[Intents.EXCHANGERATE_CUR] = getExchangeRateHandler;
handlers[Intents.EXCHANGERATE_DATE] = getExchangeRateHandler;
handlers[Intents.EXCHANGERATE_MIX] = getExchangeRateHandler;
handlers[Intents.AMAZON_CANCEL] = amazonCancelHandler;
handlers[Intents.AMAZON_STOP] = amazonStopHandler;
handlers[Intents.AMAZON_HELP] = amazonHelpHandler;

module.exports = handlers;
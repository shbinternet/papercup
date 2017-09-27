'use strict';

/*==============================================================================
 * FILE NAME : Handlers.js
 * DISCRIPTION : 환율조회 Alexa handlers
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

//Default imports
const GlobalApiClient = require('../../common/GlobalApiClient');
const Config = require('../../common/Config');
const GibUtil = require('../../common/GibUtil');

// default handelers
const DefaultIntents = require('../default/DefaultIntents');
const DefaultMessages = require('../default/DefaultMessages');
const DefaultEvents = require('../default/DefaultEvents');
const DefaultHandlers = require('../default/DefaultHandlers');

// Internal imports
const Intents = require('./Intents');
const Messages = require('./Messages');

/**
 * This is the handler for our custom getExchangeRateHandler intent.
 * Refer to the Intents.js file for documentation.
 */
const getExchangeRateHandler = function() {
    console.info("Starting getExchangeRateHandler()");
    var speechOutput='';
    var date='';
    var currency='';
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

    console.log(">>>>date"+date+">>>>currency"+currency + ">>>>>amount"+ amount);
    
    let globalData = Config.openApiConfig;    
    globalData.path = "/global_api/exchangerate?date="+date+"&currency="+currency;

    const globalApiClient = new GlobalApiClient(globalData);

    let globalApiRequest = globalApiClient.getGlobalApi();  
	globalApiRequest.then((globalApiResponse) => {
		switch(globalApiResponse.statusCode) {
			case 200:
				console.log(">>>>globalApiResponse.reqData=" + JSON.stringify(globalApiResponse.reqData));
				 if(globalApiResponse.reqData.data.length==0){
		            speechOutput = Messages.NO_CURRENCYRATE;
		        }else{	
		        	speechOutput = GibUtil.setSpeechOutputText(Messages.EXCHANGE_RATE_DATE,globalApiResponse.reqData);		        	
					speechOutput += GibUtil.setSpeechOutputGridDataText(Messages.EXCHANGE_RATE_CCY,globalApiResponse.reqData);					
		        }
		     

		        console.log (">>>>>>>>>speechOutput " +speechOutput)
		        this.emit(":tellWithCard", speechOutput, "SHBA", speechOutput, '');
				break;
			case 204:
                this.emit(":tellWithCard", DefaultMessages.NO_DATA);
                break;
            case 403:
                this.emit(":tellWithPermissionCard", DefaultMessages.NOTIFY_MISSING_PERMISSIONS, PERMISSIONS);
                break;
            default:
                this.emit(":ask", DefaultMessages.LOCATION_FAILURE, DefaultMessages.LOCATION_FAILURE);
		
		}		
	});
	globalApiRequest.catch((error) => {
        this.emit(":tell", DefaultMessages.ERROR);
        console.error(error);
        console.info("Ending getAccountListHandler()");
    });
};

const handlers = {};
// Add event handlers
handlers[DefaultEvents.NEW_SESSION] = DefaultHandlers.newSessionRequestHandler;
handlers[DefaultEvents.LAUNCH_REQUEST] = DefaultHandlers.launchRequestHandler;
handlers[DefaultEvents.SESSION_ENDED] = DefaultHandlers.sessionEndedRequestHandler;
handlers[DefaultEvents.UNHANDLED] = DefaultHandlers.unhandledRequestHandler;

// Add intent handlers
handlers[DefaultIntents.AMAZON_CANCEL] = DefaultHandlers.amazonCancelHandler;
handlers[DefaultIntents.AMAZON_STOP] = DefaultHandlers.amazonStopHandler;
handlers[DefaultIntents.AMAZON_HELP] = DefaultHandlers.amazonHelpHandler;
handlers[Intents.GET_EXCHANGERATE] = getExchangeRateHandler;

module.exports = handlers;
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
/*
    const accessToken = this.event.context.user.accessToken;

    // If we have not been provided with a consent token, this means that the user has not
    // authorized your skill to access this information. In this case, you should prompt them
    // that you don't have permissions to retrieve their address.
    if(!accessToken) {
        this.emit(":tellWithPermissionCard", DefaultMessages.NOTIFY_MISSING_PERMISSIONS, PERMISSIONS);

        // Lets terminate early since we can't do anything else.
        console.log("User did not give us permissions to access their address.");
        console.info("Ending getExchangeRateHandler()");
        return;
    }
*/
    let globalData = Config.openApiConfig;        
    globalData.path = "/global_api/exchangerate";

    const globalApiClient = new GlobalApiClient(globalData);

    let globalApiRequest = globalApiClient.getGlobalApi();  
	globalApiRequest.then((globalApiResponse) => {
		switch(globalApiResponse.statusCode) {
			case 200:
				console.log("D.H.Koh globalApiResponse.reqData=" + JSON.stringify(globalApiResponse.reqData));
				
				/*
                const ADDRESS_MESSAGE = Messages.ADDRESS_AVAILABLE +
                `${address['addressLine1']}, ${address['stateOrRegion']}, ${address['postalCode']}`;

                this.emit(":tell", ADDRESS_MESSAGE);				
				*/
				this.emit(":tell", JSON.stringify(globalApiResponse.reqData));
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


/**
 * 환율조회 텍스트 생성
 */
const makeExchangeRateData = function(handlerThis,jsonData) {
	
console.log("Intent Name====================>" + handlerThis.event.request.intent.name);	
	
	let speechOutput = "";
	// Access Token 오류
	if(jsonData.returnCode == '2') return CommonMessages.ERROR_NO_0002;
	// 개인인증키 오류
	if(jsonData.returnCode == '3') return CommonMessages.ERROR_NO_0003;
	// Access Token 만료
	if(jsonData.returnCode == '5') return CommonMessages.ERROR_NO_0004;
	// 처리중 오류
	if(jsonData.returnCode == '9') return CommonMessages.ERROR_NO_0009;
	// 기타에러 발생시
	if(jsonData.returnCode != '1') return CommonMessages.ERROR_NO_0009;
	
	// API 정상인증시 returnCode == '1'	
	// 전체 요청일 경우
	if(handlerThis.event.request.intent.name == Intents.GET_ACCOUNT_LIST_GRID_DATA) {
		speechOutput = Messages.ACCOUNT_LIST_GUIDE;
		speechOutput += GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_LIST_GRID_DATA,jsonData);
		
	// 계좌수 요청일 경우
	} else if(handlerThis.event.request.intent.name == Intents.GET_ACCOUNT_LIST_COUNT){		
		jsonData.grid_cnt = jsonData.data.length;		
		speechOutput = GibUtil.setSpeechOutputText(Messages.ACCOUNT_LIST_COUNT,jsonData);
	}
    
	handlerThis.emit(":tell", speechOutput);
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

handlers[Intents.GET_EXCHANGERATE_DATE] = getExchangeRateHandler;

module.exports = handlers;
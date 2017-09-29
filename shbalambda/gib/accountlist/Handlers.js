'use strict';

/*==============================================================================
 * FILE NAME : Handlers.js
 * DISCRIPTION : 계좌조회 Alexa handlers
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

// Common
const CommonMessages = require('../common/CommonMessages');

// Internal imports
const Intents = require('./Intents');
const Messages = require('./Messages');

/**
 * 예금계좌 목록조회
 */
const getAccountListGridDataHandler = function() {
    console.info("Starting getAccountListGridDataHandler()");

/*
    // If we have not been provided with a consent token, this means that the user has not
    // authorized your skill to access this information. In this case, you should prompt them
    // that you don't have permissions to retrieve their address.
    if(!accessToken) {
        this.emit(":tellWithPermissionCard", Messages.NOTIFY_MISSING_PERMISSIONS, PERMISSIONS);

        // Lets terminate early since we can't do anything else.
        console.log("User did not give us permissions to access their address.");
        console.info("Ending getAccount_ListHandler()");
        return;
    }
*/	        
        
    // 세션 존재여부 확인 persnal Key
    let personalKey = this.attributes['personalKey'];
    
    // personalkey 미존재할경우 personal key 질의
    if (personalKey == undefined || personalKey == "") {    
    	
    	// 이전인텐트 저장
    	this.attributes['preIntent'] = this.event.request.intent;
	    this.emit(':askWithCard', CommonMessages.WHAT_IS_YOUR_PERSONALKEY, CommonMessages.PERSONALKEY_INFO, Config.card_title, CommonMessages.WHAT_IS_YOUR_PERSONALKEY);
	    	    	    
	    return;
	    
    }    
    
    let globalData = Config.openApiConfig;           
    globalData.path = "/global_api/account/list";
    globalData.personKey = personalKey;   

    // accessToken 설정 (사용자 세션에 존재하지 않을경우 Config.js 설정에 있는 accessToken 설정)
    let accessToken = "";
    try {
    	accessToken = this.event.session.user.accessToken;    	
    } catch(e) {
        console.info("accessToken Exception=" + JSON.stringify(this.event.session));     	
        console.info("accessToken Exception=" + e);    	
    }
  
    if(accessToken != "") {
        globalData.accessToken = accessToken;    	
    }      
    
    globalData.sndData = {"filter": {"prdt_c" : "5017000001"}};

    const globalApiClient = new GlobalApiClient(globalData);
    let globalApiRequest = globalApiClient.getGlobalApi();  
	globalApiRequest.then((globalApiResponse) => {
		switch(globalApiResponse.statusCode) {
			case 200:
				//let tmpJson = {"returnCode":"1","data":[{"ccy_c":"USD","dep_sjt_class":"1","dep_prdt_nm":"FREE CHECKING","dep_acno":"700000282662","prdt_c":"5017000001","itype_due_dt":"","dep_ac_alnm_nm":"","apl_intrt":"0.0000000","pabl_blc":"1304576.20","ttype_due_dt":"","lcl_ac_no":"700000282662","last_cus_trx_dt":"20161025","cus_snm_nm":"********"},{"ccy_c":"USD","dep_sjt_class":"1","dep_prdt_nm":"FREE CHECKING","dep_acno":"700000010609","prdt_c":"5017000001","itype_due_dt":"","dep_ac_alnm_nm":"","apl_intrt":"0.0000000","pabl_blc":"9997016932.27","ttype_due_dt":"","lcl_ac_no":"1111015658","last_cus_trx_dt":"20161101","cus_snm_nm":"********"}]};
				//globalApiResponse.reqData = tmpJson;
				makeAccountListGridData(this,globalApiResponse.reqData);
				break;
			case 204:
                this.emit(":tellWithCard", DefaultMessages.NO_DATA, Config.card_title, DefaultMessages.NO_DATA);
                break;
            case 403:
                this.emit(":tellWithPermissionCard", DefaultMessages.NOTIFY_MISSING_PERMISSIONS, PERMISSIONS);
                break;
            default:
                this.emit(":askWithCard", DefaultMessages.GLOBAL_API_FAILURE, "", Config.card_title, DefaultMessages.GLOBAL_API_FAILURE);		
		}
	});

	globalApiRequest.catch((error) => {
        this.emit(":tellWithCard", DefaultMessages.ERROR, Config.card_title, DefaultMessages.ERROR);
        console.error(error);
        console.info("Ending getAccountListHandler()");
    });
};


/**
 * 예금계좌 목록조회 텍스트 생성
 */
const makeAccountListGridData = function(handlerThis,jsonData) {
	
console.log("Intent Name====================>" + handlerThis.event.request.intent.name);
console.log("jsonData.returnCode====================>" + jsonData.returnCode);
	
	let speechOutput = "";
	// Access Token 오류
	if(jsonData.returnCode == '2') speechOutput = CommonMessages.ERROR_NO_0002;
	// 개인인증키 오류
	else if(jsonData.returnCode == '3') speechOutput = CommonMessages.ERROR_NO_0003;
	// Access Token 만료
	else if(jsonData.returnCode == '5') speechOutput = CommonMessages.ERROR_NO_0004;
	// 처리중 오류
	else if(jsonData.returnCode == '9') speechOutput = CommonMessages.ERROR_NO_0009;
	// 정상일 경우
	else if(jsonData.returnCode == '1') {
		// AccountList 일경우
		if(handlerThis.event.request.intent.name == Intents.GET_ACCOUNT_LIST) {
			speechOutput = Messages.ACCOUNT_LIST_GUIDE;
			speechOutput += GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_LIST_GRID_DATA,jsonData);
			
		// 일치하는 intent 가 존재하지 않을경우 
		} else {
			speechOutput = CommonMessages.UNHANDLED;
		}
	// 기타에러 발생시		
	} else {
		speechOutput = CommonMessages.ERROR_NO_0009;		
	}
		
	handlerThis.emit(":tellWithCard", speechOutput, Config.card_title, speechOutput);
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

// 사용자 intent handlers
handlers[Intents.GET_ACCOUNT_LIST] = getAccountListGridDataHandler;

module.exports = handlers;
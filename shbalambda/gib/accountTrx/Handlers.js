'use strict';

/*==============================================================================
 * FILE NAME : Handlers.js
 * DISCRIPTION : 계좌조회 Alexa handlers
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-10-10   최윤주 최초작성
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
const getAccountTrxHandler = function() {
    console.info("Starting getAccountTrxHandler()");
   
        
    // 세션 존재여부 확인 persnal Key
    // let personalKey = this.attributes['personalKey'];
    
    // // personalkey 미존재할경우 personal key 질의
    // if (personalKey == undefined || personalKey == "") {    
    	
    // 	// 이전인텐트 저장
    // 	this.attributes['preIntent'] = this.event.request.intent;
	   //  this.emit(':askWithCard', CommonMessages.WHAT_IS_YOUR_PERSONALKEY, CommonMessages.PERSONALKEY_INFO, Config.card_title, CommonMessages.WHAT_IS_YOUR_PERSONALKEY);
	    	    	    
	   //  return;
	    
    // }    
    
    let globalData = Config.openApiConfig;           
    globalData.path = "/global_api/account/transaction";
    globalData.personKey = "1234";   

    // accessToken 설정 (사용자 세션에 존재하지 않을경우 Config.js 설정에 있는 accessToken 설정)
    let accessToken = "5c3c7fc91b5443f6934d785ee38ded9d53a302ce971f4b1d98e8ce9ba63dd9e9b590b8b756dc4ce0ac53ca459a436b653159af979e764553891e7e5882cdbbbb02a559ce9a5a4d6597b88aaf87abd81b0f90888410384adca27332b65e1d19ff";
    // try {
    // 	accessToken = this.event.session.user.accessToken;    	
    // } catch(e) {
    //     console.info("accessToken Exception=" + JSON.stringify(this.event.session));     	
    //     console.info("accessToken Exception=" + e);    	
    // }
  
    // if(accessToken != "") {
    //     globalData.accessToken = accessToken;    	
    // }      
    globalData.accessToken=accessToken;  //임시 

    var trx_type = isSlotValid(this.event.request, "TRX_TYPE");
    var date= isSlotValid(this.event.request, "DATE");
    var st_date= isSlotValid(this.event.request, "START_DATE");
    var end_date= isSlotValid(this.event.request, "END_DATE");

    
    globalData.sndData = {
        "sdate":st_date,
        "edate":end_date,
        "cnt" : 5
    };

    if (trx_type!=''){
        globalData.sndData
        trx_type='C';
    }else if (trx_type=="debit"){
        trx_type='D';
    }else{
        trx_type='';
    }

    if(trx_type != ''){
        globalData.sndData = {
            "sdate":st_date,
            "edate":end_date,
            "cnt" : 5,
            "filter": {"dep_trx_rnp_d" : trx_type}
        }
    }
    


    const globalApiClient = new GlobalApiClient(globalData);
    let globalApiRequest = globalApiClient.getGlobalApi();  
	globalApiRequest.then((globalApiResponse) => {
		switch(globalApiResponse.statusCode) {
			case 200:
                console.log(">>>>>globalApiResponse.reqData"+JSON.stringify(globalApiResponse.reqData));
            
				makeAccountTrxData(this,globalApiResponse.reqData);
				break;
			case 204:
                console.log(">>>>case 204");
                this.emit(":tellWithCard", DefaultMessages.NO_DATA, Config.card_title, DefaultMessages.NO_DATA);
                break;
            case 403:
                console.log(">>>>case 403");
                this.emit(":tellWithPermissionCard", DefaultMessages.NOTIFY_MISSING_PERMISSIONS, PERMISSIONS);
                break;
            default:
                console.log(">>>>case default");
                this.emit(":askWithCard", DefaultMessages.GLOBAL_API_FAILURE, "", Config.card_title, DefaultMessages.GLOBAL_API_FAILURE);		
		}
	});

	globalApiRequest.catch((error) => {
        this.emit(":tellWithCard", DefaultMessages.ERROR, Config.card_title, DefaultMessages.ERROR);
        console.error(error);
        console.info("Ending getAccountTrxHandler()");
    });
};


/**
 * 예금계좌 목록조회 텍스트 생성
 */
const makeAccountTrxData = function(handlerThis,jsonData) {
	
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
        for(let i = 0; i < jsonData.data.length; i++) {
            jsonData.data[i].total = jsonData.data.length;    
        }
        console.log(">>>total count Ending  "+ JSON.stringify(jsonData));
		// AccountTrx일경우
		if(handlerThis.event.request.intent.name == Intents.GET_ACCOUNT_TRX) {
			speechOutput =  GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_TRX_GUIDE,jsonData);
			speechOutput += GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_TRX_DATA,jsonData);
			
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

function isSlotValid(request, slotName){
    var slot = request.intent.slots[slotName];
    //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    var slotValue;
    console.log(">>>isSlotValid, slot " + JSON.stringify(slot));
    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        if(slot.name=="TRX_TYPE"){
            slotValue = slot.value.toLowerCase();
        }else{
            slotValue=slot.value.replace(/-/g,'');
        }        
    } else {
        //we didn't get a value in the slot.
        slotValue="";
    }
    console.log(">>>>>slotValue >>" + slotValue);
    return slotValue;
}


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
handlers[Intents.GET_ACCOUNT_TRX] = getAccountTrxHandler;

module.exports = handlers;
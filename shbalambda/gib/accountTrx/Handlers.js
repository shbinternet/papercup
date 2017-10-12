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
const ApiErrorMessages = require('../../common/ApiErrorMessages.js');
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
 
        
    //세션 존재여부 확인 persnal Key
    let personalKey = this.attributes['personalKey'];
    
    // personalkey 미존재할경우 personal key 질의
    if (personalKey == undefined || personalKey == "") {    
    	
    	// 이전인텐트 저장
    	this.attributes['preIntent'] = this.event.request.intent;
	    this.emit(':askWithCard', CommonMessages.WHAT_IS_YOUR_PERSONALKEY, CommonMessages.PERSONALKEY_INFO, Config.card_title, CommonMessages.WHAT_IS_YOUR_PERSONALKEY);
	    	    	    
	    return;
	    
    }    
   
    let globalData = Config.openApiConfig;           
    globalData.path = "/global_api/account/transaction";
    globalData.personKey = personalKey;   
    console.log("globalData.personKey ====================>" + globalData.personKey); 
    // accessToken 설정 (사용자 세션에 존재하지 않을경우 Config.js 설정에 있는 accessToken 설정)
    let accessToken = this.event.session.user.accessToken;
    
    if(accessToken != undefined) globalData.accessToken = accessToken;

    console.log("globalData.accessToken ====================>" + globalData.accessToken);        
    

    var trx_type = isSlotValid(this.event.request, "TRX_TYPE");
    var date= isSlotValid(this.event.request, "DATE");
    var st_date= isSlotValid(this.event.request, "START_DATE");
    var end_date= isSlotValid(this.event.request, "END_DATE");

    if(date!=''){
        st_date=date;
        end_date=date;
    }
    
    globalData.sndData = {
        "sdate":st_date,
        "edate":end_date,
        "page" : {
            "no" : 2,
            "size" : 5
        },
    };

    if (trx_type!=''){
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
            "page" : {
                "no" : 20,
                "size" : 5
            },
            "filter": {"dep_trx_rnp_d" : trx_type}
        }
    }
    
    console.log(">>>>>trx_type : "+trx_type +">>>>>date: "+ date+ ">>>>sdate, edate"+st_date +" "+end_date);

    const globalApiClient = new GlobalApiClient(globalData);
    let globalApiRequest = globalApiClient.getGlobalApi();  
	globalApiRequest.then((globalApiResponse) => {
		switch(globalApiResponse.statusCode) {
			case 200:
                console.log(">>>>>globalApiResponse.reqData"+JSON.stringify(globalApiResponse.reqData));
                let returnCode=globalApiResponse.reqData.returnCode;
                let speechOutput = "";
                // 정상일 경우
                if(returnCode == '1')  makeAccountTrxData(this,globalApiResponse.reqData);
                // Access Token 오류 
                else if(returnCode == '2') speechOutput = CommonMessages.ERROR_NO_0002;
                // 개인인증키 오류
                else if(returnCode == '3') speechOutput = CommonMessages.ERROR_NO_0003;
                // Access Token 만료
                else if(returnCode == '5') speechOutput = CommonMessages.ERROR_NO_0004;
                // 처리중 오류
                else if(returnCode == '9') speechOutput = CommonMessages.ERROR_NO_0009;
                //그이외 
                else speechOutput = CommonMessages.ERROR_NO_0009;        
                    
                handlerThis.emit(":tellWithCard", speechOutput, Config.card_title, speechOutput);
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
    	
	let speechOutput = "";
    let page_total= jsonData.page.total;
    let page_no=jsonData.page.no;
    let page_size=jsonData.page.size;

    console.log(">>>page_total: "+page_total +">>>>page_no: "+page_no+">>>>page_size"+page_size);
	
    if(page_total>0){
        let total = "!~~total~~!";
        speechOutput = Messages.ACCOUNT_TRX_COUNT.replace(eval("/" + total + "/gi"), page_total);
        if(page_total>5){
            speechOutput += Messages.ACCOUNT_TRX_SPLIT_FIVE +Messages.ACCOUNT_TRX_SPLIT_GUIDE;
        }
    }else{
        speechOutput = Messages.ACCOUNT_TRX_ZERO_COUNT;
    }
	speechOutput += GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_TRX_DATA,jsonData);
		
	
		
	handlerThis.emit(":tellWithCard", speechOutput, Config.card_title, speechOutput);
};

function isSlotValid(request, slotName){
    var slot = request.intent.slots[slotName];
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
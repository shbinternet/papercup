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
const CommonIntents = require('../common/CommonIntents');

// Internal imports
const Intents = require('./Intents');
const Messages = require('./Messages');

/**
 * 예금거래내역 목록조회
 */
const getAccountTrxHandler = function() {
    console.info("Starting getAccountTrxHandler()");
 
        
    //세션 존재여부 확인 persnal Key
    let personalKey = this.attributes['personalKey'];
    
    // personalkey 미존재할경우 personal key 질의
    if (personalKey == undefined || personalKey == "") {    
    	
    	// 이전인텐트 저장
    	this.attributes['preIntent'] = this.event.request.intent;
    	this.attributes['preIntent'].commonIntent = CommonIntents.SET_PERSONAL_KEY;
	    this.emit(':askWithCard', CommonMessages.WHAT_IS_YOUR_PERSONALKEY, CommonMessages.PERSONALKEY_INFO, Config.card_title, CommonMessages.WHAT_IS_YOUR_PERSONALKEY);
	    	    	    
	    return;
	    
    }    

    /***************** Open Api 송신설정 START *****************/
    
    let globalData = Config.openApiConfig;           
    globalData.path = "/global_api/account/transaction";
    globalData.personKey = personalKey;   
    console.log("globalData.personKey ====================>" + globalData.personKey); 
    // accessToken 설정 (사용자 세션에 존재하지 않을경우 Config.js 설정에 있는 accessToken 설정)
    let accessToken = this.event.session.user.accessToken;
    if(accessToken != undefined) globalData.accessToken = accessToken;
    console.log("globalData.accessToken ====================>" + globalData.accessToken);        
    
    // 최초조회여부 검증
    let pageData = this.event.request.intent.page;
    let pageNo = "";
    
    if (pageData == undefined) 
        pageNo = 1;
    else
        pageNo = pageData.no;
    
    // 이전조회조건 초기화
    globalData.sndData = {};    
    globalData.sndData.page = {"no" : pageNo,"size" : 3};

    var trx_type = isSlotValid(this.event.request, "TRX_TYPE");
    var date= isSlotValid(this.event.request, "DATE");
    var st_date= isSlotValid(this.event.request, "START_DATE");
    var end_date= isSlotValid(this.event.request, "END_DATE");
    var period =  isSlotValid(this.event.request, "PERIOD");

    //특정일자 조회 : 시작일, 종료일이 같다 
    if(date!=''){
        st_date=date;
        end_date=date;
    }

    globalData.sndData.sdate = st_date;
    globalData.sndData.edate = end_date;
    if (trx_type!=''){
        trx_type='C';
    }else if (trx_type=="debit"){
        trx_type='D';
    }else{
        trx_type='';
    }

    if(trx_type != ''){
        globalData.sndData.filter = {"dep_trx_rnp_d" : trx_type}
    }
    
    if(period!=''){
        globalData.sndData.sdate= getDateFromPeriod(period);
    }





    console.log(">>>>>trx_type : "+trx_type +">>>>>date: "+ date+ ">>>>sdate, edate"+st_date +" "+end_date);
    console.log(">>>>>this this.attributes['preIntent']" +  JSON.stringify(this.attributes['preIntent']));
    // 이전 preIntent 초기화
    this.attributes['preIntent'] = null;

    /***************** Open Api 송신설정 END *****************/
    const globalApiClient = new GlobalApiClient(globalData);
    let globalApiRequest = globalApiClient.getGlobalApi();  
	globalApiRequest.then((globalApiResponse) => {
		switch(globalApiResponse.statusCode) {
			case 200:
                console.log(">>>>status 200:::::::");
                console.log(">>>>>globalApiResponse.reqData"+JSON.stringify(globalApiResponse.reqData));
                let returnCode=globalApiResponse.reqData.returnCode;
                let speechOutput = "";
                
                /*
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
                */
                
                // API 성공시
                if(returnCode == Config.successApiCode) {
                	makeAccountTrxData(this,globalApiResponse.reqData);                	
                
                // 에러발생시	
            	} else {
            		
            	    console.info("jsonData.returnCode======> "  + returnCode);
            	    console.info("ApiErrorMessages======> "  + ApiErrorMessages[returnCode]);	    
            		
            		if(returnCode != "" || returnCode != undefined) {
            			speechOutput = ApiErrorMessages[returnCode];
            			
            			// personal key 틀렸을 경우 perIntent 설정
            			if(returnCode == Config.personalKeyApiErrorCode) {
            				this.attributes['preIntent'] = this.event.request.intent;
            				this.attributes['preIntent'].commonIntent = CommonIntents.SET_PERSONAL_KEY;
            			}
            			
            		} else
            			speechOutput = ApiErrorMessages["9999"];
            	}                
                
                    
                this.emit(":tellWithCard", speechOutput, Config.card_title, speechOutput);
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
    let pageCount= Number(jsonData.page.total); // 전체거래내역수 조회
    let pageNo=Number(jsonData.page.no);
    let page_size=jsonData.page.size;

    // 최초조회여부 검증
    let pageData = handlerThis.event.request.intent.page;   

    console.log(">>>pageCount: "+pageCount +">>>>pageNo: "+pageNo+">>>>page_size"+page_size);
	
    if(pageCount>0){
        let total = "!~~total~~!";
        speechOutput = Messages.ACCOUNT_TRX_COUNT.replace(eval("/" + total + "/gi"), pageCount);
        if(pageCount>3){
            speechOutput += Messages.ACCOUNT_TRX_SPLIT_FIRST_THREE +Messages.ACCOUNT_TRX_SPLIT_GUIDE;
        }

         // 최초조회일경우
        if (pageData == undefined) {        
            speechOutput = Messages.ACCOUNT_TRX_COUNT.replace(eval("/" + total + "/gi"), pageCount);
            if(pageCount <= 3){
                speechOutput += GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_TRX_DATA,jsonData);
            }else{
                speechOutput += Messages.ACCOUNT_TRX_SPLIT_FIRST_THREE + Messages.ACCOUNT_TRX_SPLIT_GUIDE; //Let me tell you three recent transactions first.
                // 이전인텐트 저장
                handlerThis.attributes['preIntent'] = handlerThis.event.request.intent;
                handlerThis.attributes['preIntent'].commonIntent = CommonIntents.SET_YES;
                handlerThis.attributes['preIntent'].page = jsonData.page;
            }
        }else{// 다음내역조회일경우
            speechOutput = GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_TRX_DATA,jsonData);           
                
                // 이전인텐트 저장
                handlerThis.attributes['preIntent'] = handlerThis.event.request.intent; 
                handlerThis.attributes['preIntent'].commonIntent = CommonIntents.SET_YES;
                
                // 남은 건수 계산
                let currentCount = pageCount - (pageNo * 3);                                    
                
                // 남은 조회건수가 3건 미만이면 조회종료
                if(currentCount <= 0) {
                    handlerThis.attributes['preIntent'] = null;
                } else {
                    
                    // 다음페이지 조회요청
                    jsonData.page.no = pageNo + 1;
                    speechOutput += Messages.ACCOUNT_TRX_SPLIT_GUIDE;          
                    handlerThis.attributes['preIntent'].page = jsonData.page;
                }
        }

    }else{
        speechOutput = Messages.ACCOUNT_TRX_ZERO_COUNT;
    }
	//speechOutput += GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_TRX_DATA,jsonData);			
		
    handlerThis.emit(":askWithCard", speechOutput, CommonMessages.TRY_AGAIN, Config.card_title, speechOutput);

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


function getDateFromPeriod(periodValue){    
    console.log(">>>>getDateFromPeriod start: periodValue" + periodValue);
    let length= periodValue.length;
    let period = periodValue.substring(1,length-1);
    var startDay;
    var days=0;

    if(periodValue.charAt(0)=="P"){
        if(periodValue.charAt(length-1)=="D"){//eight days: P8D
            days=period;
            startDay = GibUtil.getPreNextCurrentDate(Number(days)*(-1));
        }else if(periodValue.charAt(length-1)=="W"){//eight weeks”: P8W
            days= period*7;
            startDay = GibUtil.getPreNextCurrentDate(Number(days)*(-1));
        }if(periodValue.charAt(length-1)=="M"){//eight month: P8M
            startDay = GibUtil.getPreNextCurrentMonth(Number(period)*(-1));
        }            
            console.log(">>>>getDateFromPeriod daye: "+days+ " >>startDay "+startDay);
            return startDay;
    }else{
        return;
    }
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
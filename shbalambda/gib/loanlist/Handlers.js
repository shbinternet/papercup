'use strict';

/*==============================================================================
 * FILE NAME : Handlers.js
 * DISCRIPTION : 대출조회 Alexa handlers
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-10-13	고동환	최초작성
 *=============================================================================*/

//Default imports
const GlobalApiClient = require('../../common/GlobalApiClient');
const ApiErrorMessages = require('../../common/ApiErrorMessages');
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
 * 대출조회
 */
const getLoanListHandler = function() {
    console.info("Starting getLoanListHandler()");
    
    /***************** Personal Key 검증 START *****************/ 
    // 세션 존재여부 확인 persnal Key
    let personalKey = this.attributes['personalKey'];
    
    // personalkey 미존재할경우 personal key 질의
    if (personalKey == undefined) {        	
    	// 이전인텐트 저장
    	this.attributes['preIntent'] = this.event.request.intent;
    	this.attributes['preIntent'].commonIntent = CommonIntents.SET_PERSONAL_KEY;
	    this.emit(':askWithCard', CommonMessages.WHAT_IS_YOUR_PERSONALKEY, CommonMessages.PERSONALKEY_INFO, Config.card_title, CommonMessages.WHAT_IS_YOUR_PERSONALKEY);	    
    }      
    /***************** Personal Key 검증 END *****************/

    
    /***************** Open Api 송신설정 START *****************/
    
    let globalData = Config.openApiConfig;           
    globalData.path = "/global_api/loan/list";
    globalData.personKey = personalKey;   
    console.log("globalData.personKey ====================>" + globalData.personKey); 
    // accessToken 설정 (사용자 세션에 존재하지 않을경우 Config.js 설정에 있는 accessToken 설정)
    let accessToken = this.event.session.user.accessToken;    
    if(accessToken != undefined) globalData.accessToken = accessToken;

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
		
	var dueDate = isSlotValid(this.event.request,"LOAN_DUE_DATE");
	var exeAmount = isSlotValid(this.event.request,"LOAN_EXE_AMT");
	var exeDate = isSlotValid(this.event.request,"LOAN_EXE_DT");

	if(dueDate !=''){
		var startDate=GibUtil.getPreNextMonth(dueDate,(-1)*2);
		var endDate=GibUtil.getPreNextMonth(dueDate,2);
		console.log("******startDate " +startDate + "***exe_due_dt " +endDate);
		globalData.sndData.filter = {"exe_due_dt" : " > "+startDate + " && < " + endDate};
	}

	if(exeAmount != ''){
		var startAmount =exeAmount* 0.9;
		var endAmount = exeAmount*1.1;
		console.log("******lon_exe_amt " +startAmount + "***lon_exe_amt " +endAmount);
		globalData.sndData.filter = {"lon_exe_amt" : " > "+startAmount + " && < " + endAmount};
	}

	if(exeDate != ''){
		var startDate=GibUtil.getPreNextMonth(exeDate,(-1)*2);
		var endDate=GibUtil.getPreNextMonth(exeDate,2);
		console.log("******startDate " +startDate + "***exe_due_dt " +endDate);
		globalData.sndData.filter = {"lon_exe_dt" : " > "+startDate + " && < " + endDate};
	}

	console.log(">>>>globalData >>>>"+JSON.stringify(globalData));
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
                
                if(returnCode == Config.successApiCode) {
                	makeLoanList(this,globalApiResponse.reqData);     // API 성공시  
                } else {   // 에러발생시    
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
        console.info("Ending getLoanListHandler()");
    });
};


/**
 * 대출조회 텍스트 생성
 */
const makeLoanList = function(handlerThis,jsonData) {
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
        speechOutput = Messages.LOAN_LIST_COUNT.replace(eval("/" + total + "/gi"), pageCount);
        if(pageCount>3){
            speechOutput += Messages.LOAN_LIST_SPLIT_FIRST_THREE +Messages.LOAN_LIST_SPLIT_GUIDE;
        }

         // 최초조회일경우
        if (pageData == undefined) {        
            speechOutput = Messages.LOAN_LIST_COUNT.replace(eval("/" + total + "/gi"), pageCount);
            if(pageCount <= 3){
                speechOutput += GibUtil.setSpeechOutputGridDataText(Messages.LOAN_LIST_AMOUNT+ Messages.LOAN_LIST_DATE,jsonData);
            }else{
                speechOutput += Messages.LOAN_LIST_SPLIT_FIRST_THREE + Messages.LOAN_LIST_SPLIT_GUIDE; //Let me tell you three recent transactions first.
                // 이전인텐트 저장
                handlerThis.attributes['preIntent'] = handlerThis.event.request.intent;
                handlerThis.attributes['preIntent'].commonIntent = CommonIntents.SET_YES;
                handlerThis.attributes['preIntent'].page = jsonData.page;
            }
        }else{// 다음내역조회일경우
            speechOutput = GibUtil.setSpeechOutputGridDataText(Messages.LOAN_LIST_AMOUNT+ Messages.LOAN_LIST_DATE,jsonData);           
                
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
                    speechOutput += Messages.LOAN_LIST_GUIDE_PAGE_MORE;          
                    handlerThis.attributes['preIntent'].page = jsonData.page;
                }
        }

    }else{
        speechOutput = Messages.LOAN_LIST_ZERO_COUNT;
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
        if(slot.name=="LOAN_EXE_AMT"){
            slotValue=slot.value;
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
handlers[Intents.GET_LOAN_LIST] = getLoanListHandler;

module.exports = handlers;
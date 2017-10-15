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
 * 예금계좌 목록조회
 */
const getAccountListGridDataHandler = function() {
    console.info("Starting getAccountListGridDataHandler()");
    
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
    globalData.path = "/global_api/account/list";
    globalData.personKey = personalKey;   

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
	
	
	let slotAccountType = this.event.request.intent.slots["ACCOUNT_TYPE"];
	let slotLastFourDist = this.event.request.intent.slots["LAST_FOUR_DIST"];	
	let filterAccountType = "";
	let filterLastFourDist = "";	
	
	
	// 슬롯 정상설정확인
	if(slotAccountType != undefined && slotLastFourDist != undefined ) {
	
		// 계좌타입만 조회조건으로 올경우
		if (slotAccountType.value != undefined && slotLastFourDist.value == undefined) {		
				
			if(slotAccountType.value == "checking account") filterAccountType = "CHECKING";
			else if(slotAccountType.value == "saving account") filterAccountType = "saving";
			
			filterAccountType = "like %" + filterAccountType + "%";		
			globalData.sndData.filter = {"dep_prdt_nm" : filterAccountType};
			
		// 4자리 계좌번호 조회조건으로 올경우
		} else if (slotAccountType.value == undefined && slotLastFourDist.value != undefined) {
			
			filterLastFourDist = "like %" + slotLastFourDist.value;	
			globalData.sndData.filter = {"lcl_ac_no" : filterLastFourDist};		
			
	    // 계좌타입,4자리계좌번호 모두 조회조건이 올경우 		
		} else if (slotAccountType.value != undefined && slotLastFourDist.value != undefined) {

			if(slotAccountType == "checking account") filterAccountType = "CHECKING";
			else if(slotAccountType == "saving account") filterAccountType = "saving";		
			
			filterAccountType = "like %" + filterAccountType + "%";		
			filterLastFourDist = "like %" + slotLastFourDist.value;
			
			globalData.sndData.filter = {
											"dep_prdt_nm" : filterAccountType,
											"lcl_ac_no" : filterLastFourDist												                    
										};			
		}	
	}
	
	// 이전 preIntent 초기화
	this.attributes['preIntent'] = null;
    /***************** Open Api 송신설정 END *****************/

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
	
	let emitSpeechOrder = "";
	let speechOutput = "";
	// Access Token 오류
	if(jsonData.returnCode == '2') speechOutput = CommonMessages.ERROR_NO_0002;
	// 개인인증키 오류
	else if(jsonData.returnCode == '3') speechOutput = CommonMessages.ERROR_NO_0003;
	// Access Token 만료
	else if(jsonData.returnCode == '5') speechOutput = CommonMessages.ERROR_NO_0005;
	// 처리중 오류
	else if(jsonData.returnCode == '9') speechOutput = CommonMessages.ERROR_NO_0009;
	// 정상일 경우
	else if(jsonData.returnCode == '1') {
		
		/***************** Alexa 메시지 조립 START *****************/
		// 전체계좌수 조회
		let pageCount = Number(jsonData.page.total);
		
		// 최초조회여부 검증
		let pageData = handlerThis.event.request.intent.page;		
		
		if(pageCount == 0) {
			speechOutput = Messages.ACCOUNT_LIST_NO_DATA;			
		} else {		
		    // 최초조회일경우
		    if (pageData == undefined) {   		
			 
				if(pageCount <= 3) {				
					speechOutput = GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_LIST_GRID_DATA,jsonData);
				} else {
					speechOutput = GibUtil.setSpeechOutputText(Messages.ACCOUNT_LIST_GUIDE,jsonData.page);
					speechOutput += Messages.ACCOUNT_LIST_GUIDE_MORE;						
					// 이전인텐트 저장
					handlerThis.attributes['preIntent'] = handlerThis.event.request.intent;
					handlerThis.attributes['preIntent'].commonIntent = CommonIntents.SET_YES;
					handlerThis.attributes['preIntent'].page = jsonData.page;				
				}
			// 다음내역조회일경우	
			} else {
				
				speechOutput = GibUtil.setSpeechOutputGridDataText(Messages.ACCOUNT_LIST_GRID_DATA,jsonData);			
				
				// 이전인텐트 저장
				handlerThis.attributes['preIntent'] = handlerThis.event.request.intent;	
				handlerThis.attributes['preIntent'].commonIntent = CommonIntents.SET_YES;
				
				// 남은 건수 계산
				let currentCount = jsonData.page.total - (jsonData.page.no * 3);									
				
				// 남은 조회건수가 3건 미만이면 조회종료
				if(currentCount <= 0) {
					handlerThis.attributes['preIntent'] = null;
				} else {
					
					// 다음페이지 조회요청
					jsonData.page.no = jsonData.page.no + 1;
					
					speechOutput += Messages.ACCOUNT_LIST_GUIDE_PAGE_MORE;			
					handlerThis.attributes['preIntent'].page = jsonData.page;
				}
			}
		}
		/***************** Alexa 메시지 조립 END *****************/	    

	// 기타에러 발생시		
	} else {
		speechOutput = CommonMessages.ERROR_NO_0009;		
	}
		
	handlerThis.emit(":askWithCard", speechOutput, CommonMessages.TRY_AGAIN, Config.card_title, speechOutput);
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
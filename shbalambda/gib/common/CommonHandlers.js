'use strict';

/*==============================================================================
 * FILE NAME : Handlers.js
 * DISCRIPTION : 공통 Alexa handlers
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
const CommonIntents = require('./CommonIntents');
const CommonMessages = require('./CommonMessages');


const moduleHandlers = {};

//계좌조회
moduleHandlers['accountlist'] = require('../accountlist/Handlers');
// 환율조회
moduleHandlers['exchangerate'] = require('../exchangerate/Handlers');
//계좌 거리내역 조회
moduleHandlers['accountTrx'] = require('../accountTrx/Handlers');


/**
 * 인텐드명으로 업무핸들러 객체 추출 
 */
const getNextHandler = function(intentName) {
	
	let handler;	
	for(let key in moduleHandlers) {		
		handler = moduleHandlers[key][intentName];
		if(handler) break;
	}	
	
	return handler;
	
};

/**
 * Personal Key Setting Intent
 */
const setPersonalKeyHandler = function() {
	
console.log("setPersonalKeyHandler START");
	
	let persnalKey = this.event.request.intent.slots.PERSONAL_KEY;
	
	// personal key 입력여부 검증
	if(persnalKey == undefined)
	    this.emit(':askWithCard', CommonMessages.INVALIDATE_PERSONALKEY, CommonMessages.PERSONALKEY_INFO, Config.card_title, CommonMessages.INVALIDATE_PERSONALKEY);
	
	// 이전 업무인텐트 추출
	let preIntent = this.attributes['preIntent'];
	
	// 이전 업무인텐트의 공용 인텐트 호출이 동일한지 검증
	if(preIntent.commonIntent != CommonIntents.SET_PERSONAL_KEY)
	    this.emit(':askWithCard', CommonMessages.TRY_AGAIN, CommonMessages.TRY_AGAIN, Config.card_title, CommonMessages.TRY_AGAIN);	
	
	if (preIntent == undefined)
		this.emit(':askWithCard', CommonMessages.INVALIDATE_PREINTENT, CommonMessages.INVALIDATE_PREINTENT, Config.card_title, CommonMessages.INVALIDATE_PREINTENT);	

	// personal key 세션저장
	this.attributes['personalKey'] = persnalKey.value;	
	
console.log("preIntent.name =====> " + preIntent.name);

	// 이전 업무인텐트 호출
	this.event.request.intent = preIntent;	
	
	getNextHandler(preIntent.name).call(this);
	
};



/**
 * Yes Setting Intent
 */
const setYesHandler = function() {
	
console.log("setYesHandler START");
		
	// 이전 업무인텐트 추출
	let preIntent = this.attributes['preIntent'];
	
	if (preIntent == undefined)
		this.emit(':askWithCard', CommonMessages.INVALIDATE_PREINTENT, CommonMessages.INVALIDATE_PREINTENT, Config.card_title, CommonMessages.INVALIDATE_PREINTENT);

	
console.log("preIntent.name =====> " + preIntent.name);

	// 이전 업무인텐트의 공용 인텐트 호출이 동일한지 검증
	if(preIntent.commonIntent != CommonIntents.SET_YES)
	    this.emit(':askWithCard', CommonMessages.TRY_AGAIN, CommonMessages.TRY_AGAIN, Config.card_title, CommonMessages.TRY_AGAIN);


	// 이전 업무인텐트 호출
	this.event.request.intent = preIntent;
	
	getNextHandler(preIntent.name).call(this);
	
};

/**
 * No Setting Intent
 */
const setNoHandler = function() {
	
console.log("setNoHandler START");
	
	this.attributes['preIntent'] = null;
	this.emit(':askWithCard', CommonMessages.YESNO_IS_NO, CommonMessages.YESNO_IS_NO, Config.card_title, CommonMessages.YESNO_IS_NO);
    	
};


/**
 신한은행 정보조회
**/
const getShinhanInfo =function (){
	this.attributes['preIntent'] = null;
    this.emit(":askWithCard", CommonMessages.SHINHAN_INFO, "", CommonMessages.SHINHAN_TITLE, CommonMessages.SHINHAN_INFO);       
};
/**
신한은행 지점조회
**/
const getBranchInfo = function(){
	this.attributes['preIntent'] = null;
	var speechOutput="";
	speechOutput= CommonMessages.BRANCH_INFO + CommonMessages.BRANCH_GUIDE;
    this.emit(":askWithCard", speechOutput, "", CommonMessages.SHINHAN_TITLE, speechOutput);       
};
/**
신한은행 지점 상세조회
**/
const getBranchDetail = function(){
	this.attributes['preIntent'] = null;
	console.log(">>>getBranchDetail starts()");

	var branches = {
	    "manhattan" : {
	        "address": "313 Fifth AVE New York, 10016",
	        "hour": "Monday to Friday  09:00am  to 5:00pm",
	        "telno" :"646-843-7333"
		},	
		"new york" :{
			"address": "330 Fifth AVE 4FL New York,10001",
	        "hour": "Monday to Friday  09:00am  to 5:00pm",
	        "telno" :"646-843-7300"
		}
	} 
	var branch = this.event.request.intent.slots.BRANCH_NAME.value.toLowerCase();

    if (!branches[branch]) {
        var speechOutput = CommonMessages.BRANCH_NOT_EXIST + CommonMessages.BRANCH_INFO;
    } else {
        var address = branches[branch].address;
        var hour = branches[branch].hour;
        var telno = branches[branch].telno;
        var speechOutput = branch + " branch is located at <break time='0.1s'/>"+address 
        				+ "<break time='0.1s'/>It is open " +hour
        				+"<break time='0.1s'/> telephone number is " +telno;
    }
    this.emit(":askWithCard", speechOutput, "", CommonMessages.SHINHAN_TITLE, ""); 

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
handlers[CommonIntents.SET_PERSONAL_KEY] = setPersonalKeyHandler;
handlers[CommonIntents.SET_YES] = setYesHandler;
handlers[CommonIntents.SET_NO] = setNoHandler;
handlers[CommonIntents.SHINHAN_INFO] = getShinhanInfo;
handlers[CommonIntents.BRANCH_INFO] = getBranchInfo;
handlers[CommonIntents.BRANCH_DETAIL] = getBranchDetail;

module.exports = handlers;
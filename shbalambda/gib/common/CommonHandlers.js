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
	if(persnalKey == undefined || persnalKey == "")
	    this.emit(':askWithCard', CommonMessages.INVALIDATE_PERSONALKEY, CommonMessages.PERSONALKEY_INFO, Config.card_title, CommonMessages.INVALIDATE_PERSONALKEY);

	// personal key 세션저장
	this.attributes['personalKey'] = persnalKey.value;
	
	// 이전 업무인텐트 추출
	let preIntent = this.attributes['preIntent'];

console.log("preIntent.name =====> " + preIntent.name);

	// 이전 업무인텐트 호출
	this.event.request.intent = preIntent;	
	
	getNextHandler(preIntent.name).call(this);
	
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

module.exports = handlers;
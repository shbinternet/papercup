'use strict';

/*==============================================================================
 * FILE NAME : DefaultHandlers.js
 * DISCRIPTION : 공통 Alexa amazon handlers (아마존기본지원,이벤트 인텐드 모듈정의)
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

const DefaultMessages = require('./DefaultMessages');
const DefaultEvents = require('./DefaultEvents');

let DefaultHandlers = {
		/**
		 * This is the handler for the NewSession event.
		 * Refer to the  DefaultEvents.js file for more documentation.
		 */
		'newSessionRequestHandler' : function() {
		    console.info("Starting newSessionRequestHandler()");
		
		    if(this.event.request.type === DefaultEvents.LAUNCH_REQUEST) {
		        this.emit(DefaultEvents.LAUNCH_REQUEST);
		    } else if (this.event.request.type === "IntentRequest") {
		        this.emit(this.event.request.intent.name);
		    }
		
		    console.info("Ending newSessionRequestHandler()");
		},
		
		/**
		 * This is the handler for the LaunchRequest event. Refer to
		 * the DefaultEvents.js file for more documentation.
		 */
		'launchRequestHandler' : function() {
		    console.info("Starting launchRequestHandler()");
		    this.emit(":ask", DefaultMessages.WELCOME + DefaultMessages.WHAT_DO_YOU_WANT, DefaultMessages.WHAT_DO_YOU_WANT);
		    console.info("Ending launchRequestHandler()");
		},
		
		/**
		 * This is the handler for the SessionEnded event. Refer to
		 * the DefaultEvents.js file for more documentation.
		 */
		'sessionEndedRequestHandler' : function() {
		    console.info("Starting sessionEndedRequestHandler()");
		    this.emit(":tell", DefaultMessages.GOODBYE);
		    console.info("Ending sessionEndedRequestHandler()");
		},
		
		/**
		 * This is the handler for the Unhandled event. Refer to
		 * the DefaultEvents.js file for more documentation.
		 */
		'unhandledRequestHandler' : function() {
		    console.info("Starting unhandledRequestHandler()");
		    this.emit(":ask", DefaultMessages.UNHANDLED, DefaultMessages.UNHANDLED);
		    console.info("Ending unhandledRequestHandler()");
		},
		
		/**
		 * This is the handler for the Amazon help built in intent.
		 * Refer to the Intents.js file for documentation.
		 */
		'amazonHelpHandler' : function() {
		    console.info("Starting amazonHelpHandler()");
		    this.emit(":ask", DefaultMessages.HELP, DefaultMessages.HELP);
		    console.info("Ending amazonHelpHandler()");
		},
		
		/**
		 * This is the handler for the Amazon cancel built in intent.
		 * Refer to the Intents.js file for documentation.
		 */
		'amazonCancelHandler' : function() {
		    console.info("Starting amazonCancelHandler()");
		    this.emit(":tell", DefaultMessages.GOODBYE);
		    console.info("Ending amazonCancelHandler()");
		},
		
		/**
		 * This is the handler for the Amazon stop built in intent.
		 * Refer to the Intents.js file for documentation.
		 */
		'amazonStopHandler' : function() {
		    console.info("Starting amazonStopHandler()");
		    //this.emit(":ask", DefaultMessages.STOP, DefaultMessages.STOP);
		    console.info("Ending amazonStopHandler()");
		}
}

module.exports = DefaultHandlers;
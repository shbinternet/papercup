'use strict';

/*==============================================================================
 * FILE NAME : Config.js
 * DISCRIPTION : Alexa Lambda 관련 환경설정정의
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

var Config = {
    // TODO Add Application ID
    appId : '',
    // TODO Add an appropriate welcome message.
    welcome_message : '<WELCOME_MESSAGE>',
    
    card_title : 'Global Internet Banking Shinhan America',

    // TODO API 송신데이터설정
    openApiConfig : {
    	"domain": "satst.shinhanglobal.com",
    	"path": "/global_api/account/list",
    	"accessToken": "e23ceb2e5b7a49dbb7bbdf121ca0f38eb898cfa93f5d44e190e6f02b6360ce1c4335780fea7044c8bfb36abaa364b4cfe35bcabb10e74e42b2d20f098d2feebef69a4094b65a48d8ac78ba726fd880f26bb423edbf0044ccbce1919aa63e1010",
    	"personKey": "",
    	"sndData": {}    	    	
    }
};

module.exports = Config;
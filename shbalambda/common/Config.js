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
    	"accessToken": "7d3ab9b2d26c46abae2623e9630473703b75d2e40b49443eafb5b9578167ce630f09f1c34bdd4f179869389c8728b92f3c1968cd84044809bec3e8a0115d65eb7f18258ad049471c9615ac3a8f2add4585fb8ac25e1c4911a76f5e44f21b019c",
    	"personKey": "",
    	"sndData": {}    	    	
    },
    
    // API 성공코드
    successApiCode : "1" ,
    // API personal key 오류코드
    personalKeyApiErrorCode : "3"
};

module.exports = Config;
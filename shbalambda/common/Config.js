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
    	"accessToken": "c462228eabea48ab9972272a01ab5d5db7882ae15c9b4ff8bec9d141fa2b82b8c764b186b6ef4a14b832b4db91a9d1096cf66b92421f4a78825f437aaf85f3b1df044c8424ba44879d7c4ee251e391eef900327e680b41c88ba7728cf15d6ad4",
    	"personKey": "",
    	"sndData": {}    	    	
    },
    
    // API 성공코드
    successApiCode : "1" ,
    // API personal key 오류코드
    personalKeyApiErrorCode : "3"
};

module.exports = Config;
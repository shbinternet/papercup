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
    	"accessToken": "5c3c7fc91b5443f6934d785ee38ded9d53a302ce971f4b1d98e8ce9ba63dd9e9b590b8b756dc4ce0ac53ca459a436b653159af979e764553891e7e5882cdbbbb02a559ce9a5a4d6597b88aaf87abd81b0f90888410384adca27332b65e1d19ff",
    	"personKey": "1234",
    	"sndData": {}    	    	
    }
};

module.exports = Config;
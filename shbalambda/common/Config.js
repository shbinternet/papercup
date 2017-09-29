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
    	"accessToken": "0c94dc57dd4948a48cd043c03a520635134af728ae344cb38c328aa681e6cea733a8087e5750463787fc7282547c5518e8adab4b6cbb43c8ba045eb0dbb59c5b85d4e40c43f54d09a1a19ff1a94588b3e607c86fdb0b4642b6e8e3eea5255447",
    	"personKey": "1234",
    	"sndData": {}    	    	
    }
};

module.exports = Config;
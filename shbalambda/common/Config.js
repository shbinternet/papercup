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
    	"accessToken": "1c5e8aaff7bf46dfb93eaf2f1ffbfa1e83c1725bc4ea4230ae0852f0d1b8a6b1ee7b9b76fa6d434788c23070691fa08a3d33a50721b6427e866e3810532b9a9a797dcc6358cc41e7b8398032546f4b7c2aff3568a83b48569916efc6312e940d",
    	"personKey": "",
    	"sndData": {}    	    	
    }
};

module.exports = Config;
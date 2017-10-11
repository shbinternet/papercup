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
    	"accessToken": "4362164349254bdbbd10f5f973253e17ba751a65174b49168549d8a6dea8cf4cc0f492da087f4eb4a0e0f3626a9925601716953ab17f4ab096075b8ab6a962bde6068aea68d7431b864fb411a6477fab3b26f6104cb64fbfa503efe75a9ae5fe",
    	"personKey": "",
    	"sndData": {}    	    	
    }
};

module.exports = Config;
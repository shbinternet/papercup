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

    // TODO API 송신데이터설정
    openApiConfig : {
    	"domain": "satst.shinhanglobal.com",
    	"path": "/global_api/account/list",
    	"accessToken": "ef572b0472a949399de7b6b44712a02704bf9d0479114c8f83be211138f8d70d11011c6ef7f342fd95f9c8811080193db597f6b153a4465fbdc66905f736b9a0f791977fcc5c4445b6178cd36efd9a64f836f4b4b65c4bb9975edaa6dc99faf7",
    	"personKey": "3456",
    	"sndData": {}    	    	
    }
};

module.exports = Config;
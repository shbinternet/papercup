'use strict';

/*==============================================================================
 * FILE NAME : GibUtil.js
 * DISCRIPTION : 공통 Util
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

const GibAlexaStringFormatUtil = require('./GibAlexaStringFormatUtil');

let gibUtil = {

		
	    /**
	     * 응답 json 데이터 형식변환
	     * @param messageStr : 형식 String
	     * @param jsonData : 변환요청데이터
	     */
		'setSpeechOutputText' : function(messageStr,jsonData) {
						
			let item = "";
			let value = "";			
				
			for(let key in jsonData) {
		    	item = "!~~" + key + "~~!";
		    	value = jsonData[key];
		    	messageStr = messageStr.replace(eval("/" + item + "/gi"), value);
			}
			 		    
		    return messageStr;
		},		
		
	    /**
	     * 응답 json Grid 데이터 형식변환
	     * @param messageStr : 형식 String
	     * @param jsonData : 변환요청데이터
	     */
		'setSpeechOutputGridDataText' : function(messageStr,jsonData) {
						
			let item = "";
			let value = "";
			let tmpStr = "";
			let speechOutPut = "";
			
			for(let i = 0; i < jsonData.data.length; i++) {
				
				tmpStr = messageStr;				
				for(let key in jsonData.data[i]) {
			    	item = "!~~" + key + "~~!";
			    	value = jsonData.data[i][key];
			    	tmpStr = tmpStr.replace(eval("/" + item + "/gi"), value);
				}
				speechOutPut += tmpStr;				
			}

		    return speechOutPut;
		}
			
}

module.exports = gibUtil;
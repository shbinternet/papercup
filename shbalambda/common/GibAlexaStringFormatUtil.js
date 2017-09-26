'use strict';

/*==============================================================================
 * FILE NAME : GibAlexaStringFormatUtil.js
 * DISCRIPTION : Alexa 포멧변환 Util
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

let GibAlexaStringData = {
		
		'last_cus_trx_dt' : 'date',
		'itype_due_dt' : 'date',
		'ttype_due_dt' : 'date'
}


let GibAlexaStringFormatUtil = {

		/**
	     * Alexa 날짜형식변환
	     * @param str : 원본데이터
	     */
		'setAlexaformat' : function(itemKey,itemValue) {
			
			for(let key in GibAlexaStringData) {
				if(key == itemKey) {
					if(GibAlexaStringData[key] == "date") {
						itemValue = itemValue
					}
						
				}
			}			
		    return itemValue;
		},			
		
		/**
	     * Alexa 날짜형식변환
	     * @param str : 원본데이터
	     */
		'getDateformat' : function(str) {						
			str = "<say-as interpret-as='date'>" + str + "</say-as>"; 		    
		    return str;
		}

}

module.exports = GibAlexaStringFormatUtil;
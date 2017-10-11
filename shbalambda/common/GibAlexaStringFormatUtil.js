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
		
		'lcl_ac_no' : 'last_four_dist',
		'pabl_blc' : 'amount',
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
					// 날짜 형식 변환
					if(GibAlexaStringData[key] == "date") {
						itemValue = getDateformat(itemValue);
					// 금액 소수점 반올림처리	
					} else if(GibAlexaStringData[key] == "amount") {
						itemValue = getRoundUpCurrency(itemValue);						
					} else if(GibAlexaStringData[key] == "last_four_dist") {
						itemValue = getLastFourDist(itemValue);						
					}
				}
			}			
		    return itemValue;
		}

}

/**
 * Alexa 날짜형식변환
 */
const getDateformat = function(str) {
    return "<say-as interpret-as='date'>" + str + "</say-as>";	
};
/**
 * Alexa 날짜형식변환
 */
const getRoundUpCurrency = function(amount){
	return amount = (amount*1000)/1000;	
};

/**
 * Alexa 계좌번호 끝 4자리 반환
 */
const getLastFourDist = function(account){
	return account = account.substr(account.length-4,account.length);	
};

module.exports = GibAlexaStringFormatUtil;
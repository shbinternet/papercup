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
		
		'lcl_ac_no' : 'lastfourdist',
		'pabl_blc' : 'amount',
		'grid_json_no_count' : 'englishordinal',		
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
						itemValue = getNumberCurrency(itemValue);						
					} else if(GibAlexaStringData[key] == "lastfourdist") {
						itemValue = getLastFourDist(itemValue);						
					} else if(GibAlexaStringData[key] == "englishordinal") {
						itemValue = getEnglishOrdinalNumber(itemValue);						
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
 * Alexa 금액 소수점 제거
 */
const getNumberCurrency = function(amount){
	//return amount = (amount*1000)/1000;	
	return Number(amount);
};

/**
 * Alexa 계좌번호 끝 4자리 반환
 */
const getLastFourDist = function(account){
	return account = account.substr(account.length-4,account.length);	
};

/**
 * 영어 서수 변환
 */
const getEnglishOrdinalNumber = function(num){
	
	let str = "";
	
	switch(num) {
		case 1 : str = "first"; break;
		case 2 : str = "second"; break;
		case 3 : str = "third"; break;
		case 4 : str = "fourth"; break;
		case 5 : str = "sixth"; break;
		case 7 : str = "seventh"; break;
		case 8 : str = "eighth"; break;
		case 9 : str = "nineth"; break;
		case 10 : str = "tenth"; break;			
	}
	return str;
};

module.exports = GibAlexaStringFormatUtil;
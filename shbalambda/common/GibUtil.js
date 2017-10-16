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
		    	value = GibAlexaStringFormatUtil.setAlexaformat(key,jsonData[key]);
		    	messageStr = messageStr.replace(eval("/" + item + "/gi"), value);
			}
			
			messageStr += "<break time='0.2s'/>";			
			 		    
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
			    	value = GibAlexaStringFormatUtil.setAlexaformat(key,jsonData.data[i][key]);
			    	tmpStr = tmpStr.replace(eval("/" + item + "/gi"), value);
				}
				// 순번 replace
				tmpStr = tmpStr.replace(eval("/!~~grid_json_no_count~~!/gi"), GibAlexaStringFormatUtil.setAlexaformat("grid_json_no_count",i+1));
				
				speechOutPut += tmpStr;				
				
				
				speechOutPut += "<break time='0.2s'/>";
			}

		    return speechOutPut;
		},
		
	    /**
	     * 현재일자 계산 (형식 YYYYMMDD)
	     */
		'getCurrentDate' : function() {
						    	        
	        return getCurrentDate();  
	        
		},
		
	    /**
	     * 날짜 과거 or 미래일자 계산 (형식 YYYYMMDD)
	     */
		'getPreNextCurrentDate' : function(nextday) {
			        
	        return getPreNextDate(getCurrentDate(),nextday);    
	        
		},				
		
	    /**
	     * 날짜 과거 or 미래일자 계산 (형식 YYYYMMDD)
	     */
		'getPreNextDate' : function(fixedDate,nextday) {
			        
	        return getPreNextDate(fixedDate,nextday);    
	        
		},
		
	    /**
	     * 월 과거 or 미래일자 계산 (형식 YYYYMMDD)
	     */
		'getPreNextCurrentMonth' : function(nextmonth) {
			        
	        return getPreNextMonth(getCurrentDate(),nextmonth);    
	        
		},				
		
	    /**
	     * 월 과거 or 미래일자 계산 (형식 YYYYMMDD)
	     */
		'getPreNextMonth' : function(fixedDate,nextmonth) {
			        
	        return getPreNextMonth(fixedDate,nextmonth);    
	        
		}		
					
};


/**
 * 현재일자 계산 (형식 YYYYMMDD)
 */
const getCurrentDate = function() {
				
    let date = new Date();
    
    let str = setFillZeros(date.getFullYear(), 4) + setFillZeros(date.getMonth() + 1, 2) + setFillZeros(date.getDate(), 2);    	        
    return str;  
    
};

/**
 * 날짜 과거 or 미래일자 계산 (형식 YYYYMMDD)
 */
const getPreNextDate = function(fixedDate,nextday) {
	
	let year = Number(fixedDate.substr(0,4));
	let month = Number(fixedDate.substr(4,2))-1;
	let day = Number(fixedDate.substr(6,2));
	
    let date = new Date(year,month,day);  
    
    date.setDate(date.getDate() + nextday);
    
    let str = setFillZeros(date.getFullYear(), 4) + setFillZeros(date.getMonth() + 1, 2) + setFillZeros(date.getDate(), 2);    	        
    return str;    
    
};

/**
 * 월 과거 or 미래일자 계산 (형식 YYYYMMDD)
 */
const getPreNextMonth = function(fixedDate,nextmonth) {
	
	let year = Number(fixedDate.substr(0,4));
	let month = Number(fixedDate.substr(4,2))-1;
	let day = Number(fixedDate.substr(6,2));
	
    let date = new Date(year,month,day);  
    
    date.setMonth(date.getMonth() + nextmonth);           
    
    let str = setFillZeros(date.getFullYear(), 4) + setFillZeros(date.getMonth() + 1, 2) + setFillZeros(date.getDate(), 2);    	        
    return str;    
    
};

/**
 * digit 지정 문자 앞에 0문자 추가
 */
const setFillZeros = function(n,digits) {
	
    let zero = '';  
    n = n.toString();  

    if (n.length < digits) {  
        for (let i = 0; i < digits - n.length; i++)  
            zero += '0';  
    }  
    return zero + n;  	
		
};

module.exports = gibUtil;
'use strict';

/*==============================================================================
 * FILE NAME : Messages.js
 * DISCRIPTION : 환율조회 Alexa 업무 Messages (사용자 정의 업무로직 Message 정의)
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

const CURRENCY_GUIDE = "Here is your currency request : ";
const EXCHANGE_RATE_DATE = "As for <say-as interpret-as='date'>!~~ntfct_dt~~!</say-as>, "
const EXCHANGE_RATE_CCY = "<break time='0.5s'/> USD to !~~ccy_c~~! is !~~round_cash_sel_rt~~!";
const EXCHANGE_CONVERT = "\n<break time='0.5s'/>and !~~amount~~! US dollar is !~~convert_amt~~! !~~ccy_c~~!"
const NO_CURRENCYRATE = "Currency rate is not exist.";
const NO_CURRENCY_APICALL = "currency API is not updated"

module.exports = {
    "CURRENCY_GUIDE": CURRENCY_GUIDE,
    "NO_CURRENCYRATE" : NO_CURRENCYRATE,
    "NO_CURRENCY_APICALL" : NO_CURRENCY_APICALL,    
    "EXCHANGE_RATE_DATE": EXCHANGE_RATE_DATE,
    "EXCHANGE_RATE_CCY": EXCHANGE_RATE_CCY,
    "EXCHANGE_CONVERT" : EXCHANGE_CONVERT
};

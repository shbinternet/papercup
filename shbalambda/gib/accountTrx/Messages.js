'use strict';

/*==============================================================================
 * FILE NAME : Messages.js
 * DISCRIPTION : 계좌조회 Alexa 업무 Messages (사용자 정의 업무로직 Message 정의)
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-10-10	최윤주	최초작성
 *=============================================================================*/

const ACCOUNT_TRX_COUNT = "There is !~~total~~! transaction history.";
const ACCOUNT_TRX_SPLIT_FIRST_THREE = "<break time='0.2s'/>Let me tell you three recent transactions first.";
const ACCOUNT_TRX_SPLIT_GUIDE = "<break time='0.2s'/>You can say <emphasis level='strong'>next</emphasis> to check next 3 transaction history";
const ACCOUNT_TRX_ZERO_COUNT = "<break time='0.2s'/>There is no transaction history.";

const ACCOUNT_TRX_DATA = " !~~dep_ac_ledg_trx_amt~~! !~~trx_ccy_c~~! was tranfered <break time='0.1s'/>on "
						+"<break time='0.2s'/><say-as interpret-as='date'>!~~oprt_dt~~!</say-as>"
						+"<break time='0.4s'/><say-as interpret-as='digits'>!~~dep_trx_memo_ctt1~~! </say-as>";

const ACCOUNT_BALANCE_DATA ="Now you have !~~dep_ac_blc~~! on your account. "


module.exports = {
    "ACCOUNT_TRX_COUNT": ACCOUNT_TRX_COUNT,
    "ACCOUNT_TRX_SPLIT_FIRST_THREE": ACCOUNT_TRX_SPLIT_FIRST_THREE,
    "ACCOUNT_TRX_SPLIT_GUIDE" : ACCOUNT_TRX_SPLIT_GUIDE,
    "ACCOUNT_TRX_DATA": ACCOUNT_TRX_DATA,
    "ACCOUNT_TRX_ZERO_COUNT" : ACCOUNT_TRX_ZERO_COUNT,
    "ACCOUNT_BALANCE_DATA" : ACCOUNT_BALANCE_DATA
};

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

const ACCOUNT_TRX_GUIDE = "There is !~~total~~! transaction history.";
const ACCOUNT_TRX_DATA = " !~~dep_ac_ledg_trx_amt~~! !~~trx_ccy_c~~! was tranfered on <break time='0.2s'/><say-as interpret-as='date'>!~~oprt_dt~~!</say-as> with memo <break time='0.4s'/>!~~dep_trx_memo_ctt1~~! ";


module.exports = {
    "ACCOUNT_TRX_GUIDE": ACCOUNT_TRX_GUIDE,
    "ACCOUNT_TRX_DATA": ACCOUNT_TRX_DATA,
};

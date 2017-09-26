'use strict';

/*==============================================================================
 * FILE NAME : Messages.js
 * DISCRIPTION : 계좌조회 Alexa 업무 Messages (사용자 정의 업무로직 Message 정의)
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

const ACCOUNT_LIST_GUIDE = "this is your accounts.";
const ACCOUNT_LIST_GRID_DATA = " !~~lcl_ac_no~~! has !~~ccy_c~~! !~~pabl_blc~~! and last tansaction was !~~last_cus_trx_dt~~!. ";
const ACCOUNT_LIST_COUNT = "you have !~~grid_cnt~~! accounts";

module.exports = {
    "ACCOUNT_LIST_GUIDE": ACCOUNT_LIST_GUIDE,
    "ACCOUNT_LIST_GRID_DATA": ACCOUNT_LIST_GRID_DATA,
    "ACCOUNT_LIST_COUNT": ACCOUNT_LIST_COUNT,
};
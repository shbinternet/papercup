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

const ACCOUNT_LIST_GUIDE = "You have !~~total~~! accounts.";
const ACCOUNT_LIST_GUIDE_MORE = "You have more than 3 accounts.Do you want to listen the first 3 accounts?";
const ACCOUNT_LIST_GUIDE_PAGE_MORE = "Do you want to continue to check more account?";


const ACCOUNT_LIST_GRID_DATA = "The !~~grid_json_no_count~~! your available !~~dep_sjt_class~~! and last four digit of account number !~~lcl_ac_no~~! is !~~pabl_blc~~!<break time='0.2s'/>";


module.exports = {
    "ACCOUNT_LIST_GUIDE": ACCOUNT_LIST_GUIDE,
    "ACCOUNT_LIST_GUIDE_MORE": ACCOUNT_LIST_GUIDE_MORE,
    "ACCOUNT_LIST_GRID_DATA": ACCOUNT_LIST_GRID_DATA,
    "ACCOUNT_LIST_GUIDE_PAGE_MORE": ACCOUNT_LIST_GUIDE_PAGE_MORE,    
};
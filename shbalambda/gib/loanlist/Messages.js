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

const LOAN_LIST_COUNT = "There are !~~total~~! loans.";
const LOAN_LIST_SPLIT_FIRST_THREE = "You have more than 3 loans.Do you want to listen the first 3 loan information?";
const LOAN_LIST_GUIDE_PAGE_MORE = "Do you want to continue to check it?";
const LOAN_LIST_ZERO_COUNT = "There is no loan account.";

const LOAN_LIST_AMOUNT="Your loan amount is !~~lon_exe_amt~~! USD and !~~lon_exe_blc~~! USD left"
const LOAN_LIST_DATE="Your loan execute from !~~lon_exe_dt~~! and it is due till !~~exe_due_dt~~!"
const LOAN_LIST_NO_DATA = "You don't have any loans.";

module.exports = {
    "LOAN_LIST_COUNT": LOAN_LIST_COUNT,
    "LOAN_LIST_SPLIT_FIRST_THREE": LOAN_LIST_SPLIT_FIRST_THREE,
    "LOAN_LIST_GUIDE_PAGE_MORE": LOAN_LIST_GUIDE_PAGE_MORE,
    "LOAN_LIST_ZERO_COUNT" : LOAN_LIST_ZERO_COUNT,
    "LOAN_LIST_AMOUNT": LOAN_LIST_AMOUNT,    
    "LOAN_LIST_DATE" : LOAN_LIST_DATE,
    "LOAN_LIST_NO_DATA":LOAN_LIST_NO_DATA
};
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

const LOAN_LIST_GUIDE = "There are !~~total~~! loans.";
const LOAN_LIST_GUIDE_MORE = "You have more than 3 loans.Do you want to listen the first 3 loan information?";
const LOAN_LIST_GUIDE_PAGE_MORE = "Do you want to continue to check it?";


const LOAN_LIST_GRID_DATA = "The !~~grid_json_no_count~~! {loan type} contrated on {contract date}'s principal and interest are {P amount} and {I amount}.<break time='0.2s'/>";
const LOAN_LIST_NO_DATA = "You don't have any loans.";

module.exports = {
    "LOAN_LIST_GUIDE": LOAN_LIST_GUIDE,
    "LOAN_LIST_GUIDE_MORE": LOAN_LIST_GUIDE_MORE,
    "LOAN_LIST_GRID_DATA": LOAN_LIST_GRID_DATA,
    "LOAN_LIST_GUIDE_PAGE_MORE": LOAN_LIST_GUIDE_PAGE_MORE,    
    "LOAN_LIST_NO_DATA":LOAN_LIST_NO_DATA
};
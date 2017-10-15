'use strict';

/*==============================================================================
 * FILE NAME : Intents.js
 * DISCRIPTION : 공통 Intents (사용자 정의 업무로직 Intent 정의)
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

/**
 * This is a custom intent for our skill. It will indicate
 * When received, we should retrieve the customer's data from
 * the Address API.
 */
const SET_PERSONAL_KEY = "SetPersonalKey";

const SET_YES = "SetYes";
const SET_NO = "SetNo";

const SHINHAN_INFO = "ShinhanInfo";


module.exports = {
    "SET_PERSONAL_KEY": SET_PERSONAL_KEY,
    "SET_YES": SET_YES,
    "SET_NO": SET_NO,
    "SHINHAN_INFO": SHINHAN_INFO     
};
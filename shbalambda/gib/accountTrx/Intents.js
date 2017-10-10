'use strict';

/*==============================================================================
 * FILE NAME : Intents.js
 * DISCRIPTION : 계좌조회 Alexa 업무 Intents (사용자 정의 업무로직 Intent 정의)
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-10-10	최윤주	최초작성
 *=============================================================================*/

/**
 * This is a custom intent for our skill. It will indicate
 * When received, we should retrieve the customer's data from
 * the Address API.
 */
const GET_ACCOUNT_TRX = "AccountTrx";


module.exports = {
    "GET_ACCOUNT_TRX": GET_ACCOUNT_TRX  
};
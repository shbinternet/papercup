'use strict';

/*==============================================================================
 * FILE NAME : Intents.js
 * DISCRIPTION : 환율조회 Alexa 업무 Intents (사용자 정의 업무로직 Intent 정의)
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
const GET_EXCHANGERATE_DATE = "ExchangeRate_date";


module.exports = {
    "GET_EXCHANGERATE_DATE": GET_EXCHANGERATE_DATE
};
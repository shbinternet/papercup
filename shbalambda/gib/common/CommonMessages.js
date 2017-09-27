'use strict';

/*==============================================================================
 * FILE NAME : CommonMessages.js
 * DISCRIPTION : 공통 Message
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

const ERROR_NO_0002 = "There was an error verifying your app."; // Access Token 오류

const ERROR_NO_0003 = "Your private key does not match. Please re-enter your private key."; // 개인인증키 오류

const ERROR_NO_0005 = "Your app verification has expired."; // Access Token 만료

const ERROR_NO_0009 = "An error occurred during processing."; // 처리중 오류

const WHAT_IS_YOUR_PERSONALKEY = "What is your personal key?";

module.exports = {
		
    "ERROR_NO_0002": ERROR_NO_0002,
    "ERROR_NO_0003": ERROR_NO_0003,
    "ERROR_NO_0005": ERROR_NO_0005,
    "ERROR_NO_0009": ERROR_NO_0009,
    
    "WHAT_IS_YOUR_PERSONALKEY": WHAT_IS_YOUR_PERSONALKEY    
    
};
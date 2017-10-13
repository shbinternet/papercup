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

const ERROR_NO_0002 = "There was an error accesstoken"; // Access Token 오류

const ERROR_NO_0003 = "Your personal key does not match<break time='0.2s'/> Please enter your personal key again"; // 개인인증키 오류

const ERROR_NO_0005 = "Your app accesstoken is expired<break time='0.2s'/> please disable and enable your skill again<break time='0.2s'/>"; // Access Token 만료

const ERROR_NO_0009 = "An error occurred during processing."; // 처리중 오류

const INVALIDATE_PREINTENT = "Please tell me another order.";

const WHAT_IS_YOUR_PERSONALKEY = "What is your personal key?";

const INVALIDATE_PERSONALKEY = "The personal key is wrong<break time='0.2s'/> Please tell me your personal key again<break time='0.2s'/>";

const PERSONALKEY_INFO = "Example My personal key is 1234";

const INVALIDATE_YESNO = "Please tell me again<break time='0.2s'/> you can say <emphasis level='strong'>next</emphasis> or <emphasis level='strong'>yes</emphasis>";

const YESNO_IS_NO = "Please tell me another order.";

const TRY_AGAIN = "please try tell me again";


module.exports = {
		
    "ERROR_NO_0002": ERROR_NO_0002,
    "ERROR_NO_0003": ERROR_NO_0003,
    "ERROR_NO_0005": ERROR_NO_0005,
    "ERROR_NO_0009": ERROR_NO_0009,
    
    "INVALIDATE_PREINTENT" : INVALIDATE_PREINTENT,
    "WHAT_IS_YOUR_PERSONALKEY": WHAT_IS_YOUR_PERSONALKEY,
    "PERSONALKEY_INFO": PERSONALKEY_INFO,
    "INVALIDATE_PERSONALKEY" : INVALIDATE_PERSONALKEY,
    "INVALIDATE_YESNO" : INVALIDATE_YESNO,
    "YESNO_IS_NO" : YESNO_IS_NO,
    "TRY_AGAIN" : TRY_AGAIN        
    
};
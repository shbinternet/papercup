'use strict';

/*==============================================================================
 * FILE NAME : ErrorMessages.js
 * DISCRIPTION : 공통 Message
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

const ERROR_NO_9000 = "An error occurred during processing."; // java 실행 오류 or 처리실패,정의되지 않은 오류

const ERROR_NO_1011 = "Your personal key does not match. Please re-enter your personal key."; // 유효하지 않는 URI 호출

const ERROR_NO_1012 = "Your app verification has expired."; // 유효하지 않는 parameter

const ERROR_NO_1013 = "An error occurred during processing."; // 유효하지 않는 Client

const ERROR_NO_1025 = "An error occurred during processing."; // refresh token 오류

const ERROR_NO_1026 = "An error occurred during processing."; // refresh token 기간만료

const ERROR_NO_1027 = "An error occurred during processing."; // 인증코드 오류 

const ERROR_NO_1028 = "There was an error accesstoken"; // access token 이미존재

const ERROR_NO_1032 = "There was an error accesstoken"; // access token 오류

const ERROR_NO_1033 = "Your personal key does not match. Please re-enter your personal key."; // personal key 오류

const ERROR_NO_1035 = "Your app verification has expired."; // access token 기간만료


const errormessages = {};

errormessages["9000"] = ERROR_NO_9000;
errormessages["1011"] = ERROR_NO_1011;
errormessages["1012"] = ERROR_NO_1012;
errormessages["1013"] = ERROR_NO_1013;
errormessages["1025"] = ERROR_NO_1025;
errormessages["1026"] = ERROR_NO_1026;
errormessages["1027"] = ERROR_NO_1027;
errormessages["1028"] = ERROR_NO_1028;
errormessages["1032"] = ERROR_NO_1032;
errormessages["1033"] = ERROR_NO_1033;
errormessages["1035"] = ERROR_NO_1035;
    
module.exports = errormessages;
  


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
const errormessages = {};


errormessages["9000"] = "An error occurred during processing<break time='0.2s'/>"; // java 실행 오류 or 처리실패,정의되지 않은 오류
errormessages["1011"] = "Your personal key does not match<break time='0.2s'/> Please re-enter your personal key."; // 유효하지 않는 URI 호출
errormessages["1012"] = "Your app verification has expired<break time='0.2s'/>"; // 유효하지 않는 parameter
errormessages["1013"] = "An error occurred during processing<break time='0.2s'/>"; // 유효하지 않는 Client
errormessages["1025"] = "An error occurred during processing<break time='0.2s'/>"; // refresh token 오류
errormessages["1026"] = "An error occurred during processing<break time='0.2s'/>"; // refresh token 기간만료
errormessages["1027"] = "An error occurred during processing<break time='0.2s'/>"; // 인증코드 오류
errormessages["1028"] = "There was an error accesstoken<break time='0.2s'/>"; // access token 이미존재
errormessages["1032"] = "There was an error accesstoken<break time='0.2s'/>"; // access token 오류
errormessages["1033"] = "Your personal key does not match<break time='0.2s'/> Please re-enter your personal key<break time='0.2s'/>"; // personal key 오류
errormessages["1035"] = "Your app verification has expired<break time='0.2s'/>"; // access token 기간만료


errormessages["2"] = "There was an error accesstoken"; // Access Token 오류
errormessages["3"] = "Your personal key does not match<break time='0.2s'/> Please enter your personal key again"; // 개인인증키 오류
errormessages["5"] = "Your app accesstoken is expired<break time='0.2s'/> please disable and enable your skill again<break time='0.2s'/>"; // Access Token 만료
errormessages["9"] = "An error occurred during processing."; // 처리중 오류

    
module.exports = errormessages;
  


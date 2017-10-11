'use strict';

/*==============================================================================
 * FILE NAME : DefaultMessages.js
 * DISCRIPTION : 공통 Alexa Events (아마존기본 이벤트 Intent 정의)
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

const WELCOME = "Welcome to Shinhan America Please tell me what you want";

const WHAT_DO_YOU_WANT = "What do you want to ask?";

const NOTIFY_MISSING_PERMISSIONS = "Please enable permissions in the Amazon Alexa app";

const NO_DATA = "Requested data does not exist";

const ERROR = "Uh Oh. Looks like something went wrong";

const GLOBAL_API_FAILURE = "There was an error with the Shinhan Global open API. Please try again";

const GOODBYE = "Bye! Thanks for using the Shinhan America!";

const UNHANDLED = "This skill doesn't support that. Please ask something else.";

const HELP = "You can use this skill by asking something like I want to konw my account";

const STOP = "There is nothing to stop Did you mean to ask something else?";

module.exports = {
    "WELCOME": WELCOME,
    "WHAT_DO_YOU_WANT": WHAT_DO_YOU_WANT,    
    "NOTIFY_MISSING_PERMISSIONS": NOTIFY_MISSING_PERMISSIONS,
    "NO_DATA": NO_DATA,
    "ERROR": ERROR,
    "GLOBAL_API_FAILURE": GLOBAL_API_FAILURE,
    "GOODBYE": GOODBYE,
    "UNHANDLED": UNHANDLED,
    "HELP": HELP,
    "STOP": STOP
};
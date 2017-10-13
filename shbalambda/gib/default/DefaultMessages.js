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

const WELCOME = "Welcome to Shinhan America <break time='0.2s'/> Experience Shinhan bank's world class financial service";

const WHAT_DO_YOU_WANT = "<break time='0.2s'/>What do you want to know?";

const NOTIFY_MISSING_PERMISSIONS = "Please enable permissions in the Amazon Alexa app";

const NO_DATA = "Requested data does not exist";

const ERROR = "Uh Oh. Looks like something went wrong";

const GLOBAL_API_FAILURE = "There was an error with calling Shinhan bank API<break time='0.2s'/> Please try again";

const GOODBYE = "Bye! Thanks for using the Shinhan America!";

const UNHANDLED = "Uh Oh<break time='0.2s'/>I can't understand you<break time='0.2s'/> Can you please ask again?";

const HELP = "You can check exchange rate<break time='0.2s'/>account balance<break time='0.2s'/>"
            +"account transaction history<break time='0.2s'/> loan transaction history with Shinhan bank america skill";

const STOP = "Thank you <break time='0.2s'/>Shinhan bank america will be always there for you <break time='0.2s'/> Bye";

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
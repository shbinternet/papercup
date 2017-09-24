'use strict';

/**
 * This file contains a map of messages used by the skill.
 */

const WELCOME = "Welcome to the Shinhan bank America!";

const WHAT_DO_YOU_WANT = "What do you want to ask?";

const NOTIFY_MISSING_PERMISSIONS = "Please wait for permission --testing-- need to change the message";

const NO_ACCOUNT = "It looks like you don't have an account list. How about open new account at world class bank, Shinhan bank.";

const ACNO_LIST_AVAILABLE = "Here is your account list: ";

const ACNO_HIS_AVAILABLE = "Here is your transaction history: ";

const ERROR = "Uh Oh. Looks like something went wrong.";

const APICALL_FAILURE = "There was an error with calling SHBA API. Please try again.";

const GOODBYE = "Bye! Thanks for using Shinhan bank America, hope to see you soon";

const UNHANDLED = "This skill doesn't support that. Please ask something else.";

const HELP = "You can use this skill by asking something like: " ;//+ HELP_CURRENCY + HELP_ACCOUNTLIST;

const HELP_CURRENCY = "I want to know KRW exchange rate";

const HELP_ACCOUNTLIST= "I want to know my account list";

const STOP = "Thank you for using.";

const PIN_ASK = "What is your pin number? ";

const PIN_WRONG = "Your pin number is wrong"

module.exports = {
    "WELCOME": WELCOME,
    "WHAT_DO_YOU_WANT": WHAT_DO_YOU_WANT,
    "NOTIFY_MISSING_PERMISSIONS": NOTIFY_MISSING_PERMISSIONS,
    "NO_ACCOUNT": NO_ACCOUNT,
    "ACNO_LIST_AVAILABLE": ACNO_LIST_AVAILABLE,
    "ACNO_HIS_AVAILABLE" : ACNO_HIS_AVAILABLE,
    "ERROR": ERROR,
    "APICALL_FAILURE": APICALL_FAILURE,
    "GOODBYE": GOODBYE,
    "UNHANDLED": UNHANDLED,
    "HELP": HELP,
    "HELP_CURRENCY" : HELP_CURRENCY,
    "HELP_ACCOUNTLIST" : HELP_ACCOUNTLIST,
    "STOP": STOP,
    "PIN_ASK" : PIN_ASK,
    "PIN_WRONG" : PIN_WRONG
};
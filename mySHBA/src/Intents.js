'use strict';

/**
 * This file contains constant definitions of intents that we're
 * interested in for our skill.
 *
 * Refer to the following link for a list of built-in intents,
 * and what those intents do.
 * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/standard-intents
 */

/**
 * This is a custom intent for our skill. It will indicate
 * When received, we should retrieve the customer's data from
 * the Address API.
 */
const EXCHANGERATE = "ExchangeRate"

const EXCHANGERATE_CUR = "ExchangeRate_cur"

const EXCHANGERATE_DATE = "ExchangeRate_date"

const EXCHANGERATE_MIX = "ExchangeRate_mix"

const ACNO_LIST = "GetAccountList"
/**
 * This is an Amazon built-in intent.
 */
const AMAZON_HELP = "AMAZON.HelpIntent";

/**
 * This is an Amazon built-in intent.
 */
const AMAZON_CANCEL = "AMAZON.CancelIntent";

/**
 * This is an Amazon built-in intent.
 */
const AMAZON_STOP = "AMAZON.StopIntent";



module.exports = {
    "AMAZON_HELP": AMAZON_HELP,
    "AMAZON_CANCEL": AMAZON_CANCEL,
    "AMAZON_STOP": AMAZON_STOP,
    "EXCHANGERATE" : EXCHANGERATE,
    "EXCHANGERATE_CUR" : EXCHANGERATE_CUR,
    "EXCHANGERATE_DATE" : EXCHANGERATE_DATE,
    "EXCHANGERATE_MIX" : EXCHANGERATE_MIX,
    "ACNO_LIST" : ACNO_LIST
};
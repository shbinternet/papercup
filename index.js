/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
 http://aws.amazon.com/apache2.0/
 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This sample shows how to create a simple Flash Card skill. The skill
 * supports 1 player at a time, and does not support games across sessions.
 */

'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */

const GlobalApiClient = require('./GlobalApiClient');

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
// Alex 이벤트 시작
exports.handler = function (event, context) {
    try {
        console.log("D.H.Koh exports.handler event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

        // 세션생성시
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        // 최초접속시
        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        // Alexa 요청시     
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        
        // Session 종료시
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
        
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("D.H.Koh onSessionStarted onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("D.H.Koh onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("D.H.Koh onIntent onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // handle yes/no intent after the user has been prompted
    if (session.attributes && session.attributes.userPromptedToContinue) {
        delete session.attributes.userPromptedToContinue;
        if ("AMAZON.NoIntent" === intentName) {
            handleFinishSessionRequest(intent, session, callback);
        } else if ("AMAZON.YesIntent" === intentName) {
            handleRepeatRequest(intent, session, callback);
        }
    }

console.log("D.H.Koh intentName=" + intentName);    
    
    // dispatch custom intents to handlers here
    if ("ExchangeRate_cur" === intentName) {
    	handleExchangeRequest(intent, session, callback);
    } else if ("ExchangeRate_date" === intentName) {
    	handleExchangeRequest(intent, session, callback);
    } else if ("ExchangeRate_mix" === intentName) {
    	handleExchangeRequest(intent, session, callback);
    } else if ("AMAZON.NoIntent" === intentName) {
    	handleExchangeRequest(intent, session, callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) { 
        handleFinishSessionRequest(intent, session, callback);
    } else {
        handleAnswerRequestException(intent, session, callback);
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific business logic (개별로직 시작) -------

var ANSWER_COUNT = 1;
var GAME_LENGTH = 5;
var CARD_TITLE = "Shinhan Bank America"; // Be sure to change this for your skill.

function getWelcomeResponse(callback) {
    var sessionAttributes = {},
        speechOutput = "Welcome to Shinhan America.",
        shouldEndSession = false,
        repromptText = "Please tell me what you want.";

    speechOutput += repromptText;
    sessionAttributes = {
        "speechOutput": speechOutput,
        "repromptText": repromptText
    };
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}

function handleAnswerRequestException(intent, session, callback) {
    
    var speechOutput = "ExceptionSpeechOutput"; 
    var repromptText = "ExceptionRepromptText";
    
    
    callback(sessionAttributes,
            buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false)); 
}


function handleExchangeRequest(intent, session, callback){
	
    var speechOutput = "";
    var repromptText = "";
    var sessionAttributes = {};
    //var currency = intent.slots.CURRENCY.value.toUpperCase();
    var currency = "";
//console.log("D.H.Koh >>>>>currency: "+currency);
    
    var accessTocken = "cd58d4a7a56b4f2682ddb78cd114930d0660babf743e44ac90a4e771adb73ed2e146c1153411409989a174e583319337df6d35f61d8546c9a933f7403dfe31d1af6758500a074202b39fe4f96ed0557141ca8d222fd847ef8f0f9b872a0fc322";
    var personalKey = "";
    var myData = JSON.parse("{}");

/*    
    httpsPost("/global_api/exchangerate",accessTocken,personalKey, myData , myResult => {
            console.log("D.H.Koh sent     : " + myData);
            console.log("D.H.Koh received : " + myResult);

            
            var jsonSpeechOutput;
            var isCurrency=false;
            if(myResult == null)
                speechOutput = "Please try again later";
            else{
                jsonSpeechOutput = myResult;
                     
                for(var i = 0; i < jsonSpeechOutput.data.length;i++) {
                    if(currency==jsonSpeechOutput.data[i].ccy_c){ 
                        speechOutput += "As of ";            
                        speechOutput += jsonSpeechOutput.ntfct_dt;
                        speechOutput += " ";     
                        console.log("<<<<<<<<<<<<<matched<<<<")   
                        isCurrency=true;                    
                        speechOutput += jsonSpeechOutput.data[i].ccy_c;
                        speechOutput += " is ";
                        speechOutput += jsonSpeechOutput.data[i].cash_sel_rt;
                        console.log("**********speechOutput*****"+ speechOutput)                        
                    }                                  
                            
                }
                
                if(!isCurrency)
                    speechOutput += "No exchange rate information available."
            }                                                            
            
            sessionAttributes = {
                    "speechOutput": speechOutput,
                    "repromptText": repromptText
                };
            callback(sessionAttributes,buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));                        

    	}
    );        
*/
       
    var globalData = {"domain": "satst.shinhanglobal.com",
    		          "path": "/global_api/account/list",
    		          "accessToken": "cd58d4a7a56b4f2682ddb78cd114930d0660babf743e44ac90a4e771adb73ed2e146c1153411409989a174e583319337df6d35f61d8546c9a933f7403dfe31d1af6758500a074202b39fe4f96ed0557141ca8d222fd847ef8f0f9b872a0fc322",
    		          "personKey": "1234",
    		          "sndData": {"ccy_c":"USD"}
    		         };
    
    const globalApiClient = new GlobalApiClient(globalData);
    let globalApiRequest = globalApiClient.getGlobalApi();              
    
    
    globalApiRequest.then((globalApiResponse) => {
        switch(globalApiResponse.statusCode) {
            case 200:
            		console.log("D.H.Koh globalApiResponse.reqData=" + JSON.stringify(globalApiResponse.reqData));
            		//callback(sessionAttributes,buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
                break;
            case 204:
                break;
            case 403:
            	console.log("The consent token we had wasn't authorized to access the user's address.");
                break;
            default:
            	console.log("Fail");

        }

        console.info("globalApiClient.getGlobalApi()");
    });    
    
    console.log("D.H.Koh received =====>: " + JSON.stringify(globalApiRequest));    
    
}


function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function handleGetHelpRequest(intent, session, callback) {
    // Provide a help prompt for the user, explaining how the game is played. Then, continue the game
    // if there is one in progress, or provide the option to start another one.

    // Set a flag to track that we're in the Help state.
    session.attributes.userPromptedToContinue = true;

    // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.

    var speechOutput = "Help Test";
    var shouldEndSession = false;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Thanks for Shinhan Bank America", "", true));
}

// ------- Helper functions to build responses (답변생성) -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

//------- open API 호출 -------
var https = require('https');
//https is a default part of Node.JS.  Read the developer doc:  https://nodejs.org/api/https.html
//try other APIs such as the current bitcoin price : https://btc-e.com/api/2/btc_usd/ticker  returns ticker.last


function httpsPost(path,accessTocken,personalKey,myData,callback) {

 // GET is a web service request that is fully defined by a URL string
 // Try GET in your browser:
 // https://cp6gckjt97.execute-api.us-east-1.amazonaws.com/prod/stateresource?usstate=New%20Jersey

 var post_options = {
     host:  'idtst.shinhanglobal.com',
     port: '443',
     path: path,
     method: 'POST',
     headers: {
         'Content-Type': 'application/json',
         'Content-Length': Buffer.byteLength(JSON.stringify(myData)),
         'X-GLOBAL-ClientId' : 'alexa72991770421',
         'X-GLOBAL-ClientSecret' : 'e6797bcf5bd14617bec0ed878d170056',
         'X-GLOBAL-AccessToken' : accessTocken,
         'X-GLOBAL-PersonalKey' : personalKey         
     }
 };

 var post_req = https.request(post_options, res => {
     res.setEncoding('utf8');
     var returnData = "";
     res.on('data', chunk =>  {
         returnData += chunk;
     });
     res.on('end', () => {
         // this particular API returns a JSON structure:
         // returnData: {"usstate":"New Jersey","population":9000000}
         console.log("D.H.Koh BODY res.on: " + returnData);
         
         var population = JSON.parse(returnData);

         callback(population);

     });
 });
 
 var strMyData = JSON.stringify(myData);
 console.log("D.H.Koh BODY httpsPost: " + strMyData); 
 
 post_req.write(strMyData);
 post_req.end();

}
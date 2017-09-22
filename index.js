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
    var Alexa = require('alexa-sdk');
    /**
     * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
     * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
     */

    // Route the incoming request based on type (LaunchRequest, IntentRequest,
    // etc.) The JSON body of the request is provided in the event parameter.
    // Alex 이벤트 시작
    exports.handler = function (event, context) {
        try {
            console.log("event.session.application.applicationId=" + event.session.application.applicationId);

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
        console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
            + ", sessionId=" + session.sessionId);

        // add any session init logic here
    }

    /**
     * Called when the user invokes the skill without specifying what they want.
     */
    function onLaunch(launchRequest, session, callback) {
        console.log("onLaunch requestId=" + launchRequest.requestId
            + ", sessionId=" + session.sessionId);

        getWelcomeResponse(callback);
    }

    /**
     * Called when the user specifies an intent for this skill.
     */
    function onIntent(intentRequest, session, callback) {
        console.log("onIntent requestId=" + intentRequest.requestId
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

    console.log("intentName=" + intentName);    
        
        // dispatch custom intents to handlers here
        if ("ExchangeRate_cur" === intentName) {
            handleExchangeCurRequest(intent, session, callback);
        } else if ("ExchangeRate_date" === intentName) {
            handleExchangeDateRequest(intent, session, callback);
        } else if ("ExchangeRate_mix" === intentName) {
            handleExchangeMixRequest(intent, session, callback);
        } else if ("GetAccountList" === intentName) {
            handleAccountListRequest(intent, session, callback);
        } else if ("AMAZON.NoIntent" === intentName) {
            handleAnswerRequest(intent, session, callback);
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
            handleAnswerRequest(intent, session, callback);
            //handleAnswerRequestException(intent, session, callback);
        }
    }
    function makeCurrencySpeechOutput(i,object){
            var speechOutput =''
            var jsonSpeechOutput = object

            speechOutput = jsonSpeechOutput.data[i].ccy_c +" : "+jsonSpeechOutput.data[i].cash_sel_rt +"\n";
            return speechOutput;
    }

    function handleExchangeCurRequest(intent, session, callback){
        var speechOutput = "";
        var repromptText = "";
        var sessionAttributes = {};
        var currency = intent.slots.CURRENCY.value.toUpperCase();

        getQuote(function (quote){
            var jsonSpeechOutput;
            var isCurrency=false;
            if(quote == '')
                speechOutput = "Please try again later";
            else{
                jsonSpeechOutput = JSON.parse(quote);   
                for(var i = 0; i < jsonSpeechOutput.data.length;i++) {
                    if(currency==jsonSpeechOutput.data[i].ccy_c){ 
                        isCurrency=true;           
                        speechOutput = jsonSpeechOutput.ntfct_dt +'\n';    
                        speechOutput += makeCurrencySpeechOutput(i,jsonSpeechOutput);                      
                    }                                  
                            
                }
                if(!isCurrency)
                    speechOutput += "No exchange rate information available."
            }                                                            
            
            sessionAttributes = {
                    "speechOutput": speechOutput,
                    "repromptText": repromptText
                };
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));            
            
        });
    }
    function handleExchangeCurRequestException(intent, session, callback) {
    
        var speechOutput = "ExceptionSpeechOutput"; 
        var repromptText = "ExceptionRepromptText";
        
        
        callback(sessionAttributes,
            buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false)); 
    }


    function handleExchangeDateRequest(intent, session, callback){
        var speechOutput = "";
        var repromptText = "";
        var sessionAttributes = {};
        var date = intent.slots.DATE.value;
        date=date.replace(/-/g,'');
        console.log(">>>>>date: "+date);
        options.path=options.path+'?date='+date;

        getQuote(function (quote){
            var jsonSpeechOutput;
            var isDate=false;
            if(quote == '') 
                speechOutput = "Please try again later";
            else{
                jsonSpeechOutput = JSON.parse(quote);
                speechOutput += jsonSpeechOutput.ntfct_dt +"\n";                
                for(var i = 0; i < jsonSpeechOutput.data.length;i++) {
                    isDate=true;               
                    speechOutput += makeCurrencySpeechOutput(i,jsonSpeechOutput);                      
                }          
                
                if(!isDate)
                    speechOutput = "No exchange rate information available on "+date;
            }                                                            
            
            sessionAttributes = {
                    "speechOutput": speechOutput,
                    "repromptText": repromptText
                };
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));            
            
        });
    }
    function handleExchangeDateRequestException(intent, session, callback) {
        
        var speechOutput = "ExceptionSpeechOutput"; 
        var repromptText = "ExceptionRepromptText";
        
        
        callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false)); 
    }

    function handleExchangeMixRequest(intent, session, callback){
        var speechOutput = "";
        var repromptText = "";
        var sessionAttributes = {};
        var currency = intent.slots.CURRENCY.value.toUpperCase();
        console.log(">>>>>currency: "+currency);
        var date = intent.slots.DATE.value;
        date=date.replace(/-/g,'');
        console.log(">>>>>date: "+date);
        options.path=options.path+'?date='+date+'&ccy='+currency;

        getQuote(function (quote){
            var jsonSpeechOutput;
            var isCheck=false;
            if(quote == '') 
                speechOutput = "Please try again later";
            else{
                jsonSpeechOutput = JSON.parse(quote);        
                speechOutput += jsonSpeechOutput.ntfct_dt+ "\n ";                
                speechOutput += " ";
                for(var i = 0; i < jsonSpeechOutput.data.length;i++) {
                    if(currency==jsonSpeechOutput.data[i].ccy_c){ 
                        isCheck=true;               
                        speechOutput += makeCurrencySpeechOutput(i,jsonSpeechOutput);                
                    }                                  
                }
                
                if(!isCheck)
                    speechOutput = "No " +currency+ " rate information available on "+date;
            }                                                            
            
            sessionAttributes = {
                    "speechOutput": speechOutput,
                    "repromptText": repromptText
                };
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));            
            
        });
    }
   
    function handleExchangeMixRequestException(intent, session, callback) {
        
        var speechOutput = "ExceptionSpeechOutput"; 
        var repromptText = "ExceptionRepromptText";
        
        
        callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false)); 
    }
    function makeAccountSpeechOutput(i,jsonSpeechOutput){
        var speechOutput=""
        speechOutput += jsonSpeechOutput.data[i].dep_prdt_nm+" : ";
        speechOutput += jsonSpeechOutput.data[i].dep_acno+"\nbalance: ";
        speechOutput += jsonSpeechOutput.data[i].ccy_c+" ";
        speechOutput += jsonSpeechOutput.data[i].pabl_blc +"\n"; 
        return speechOutput;
    }
    function checkPin(){
        var speechOutput = "What is your pin number?";
        var pinNum= intent.slots.pinNum.value;
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession);
        console.log(">>>>>>>>checkPin>>>>>"+pinNum)
        return pinNum;
    }

    function handleAccountListRequest(intent, session, callback){
        var speechOutput = "";
        var countSpeechOutput="";  
        var repromptText = "";      
        var sessionAttributes = {};
        var token='cd58d4a7a56b4f2682ddb78cd114930d0660babf743e44ac90a4e771adb73ed2e146c1153411409989a174e583319337df6d35f61d8546c9a933f7403dfe31d1af6758500a074202b39fe4f96ed0557141ca8d222fd847ef8f0f9b872a0fc322';
        var personalKey='1234';

        doE2022(token,personalKey,  jsonSpeechOutput => {
                jsonSpeechOutput = JSON.parse(jsonSpeechOutput); 
                console.log(">>>>>>>>>>>jsonSpeechOutput  " + JSON.stringify(jsonSpeechOutput))
                var count=jsonSpeechOutput.data.length;
                console.log(">>>>>>>>>>>count  " + count)
                if(count ==0){
                    speechOutput ="Something wrong --no account "
                }else{
                    countSpeechOutput= "You have "+count +" account in total\n";
                    var checking_cnt=0

                    for(var i = 0; i < count ;i++) {
                        if(jsonSpeechOutput.data[i].dep_prdt_nm == 'FREE CHECKING'){     
                            checking_cnt++;                       
                            speechOutput=makeAccountSpeechOutput(i,jsonSpeechOutput) 
                        }else{
                            speechOutput=makeAccountSpeechOutput(i,jsonSpeechOutput)
                        }                                                                        
                    }
                    countSpeechOutput += "You have "+checking_cnt+ " checking account(s) and "+ (count-checking_cnt) +" saving account\n"
                }
                sessionAttributes = {
                "speechOutput": countSpeechOutput + speechOutput,
                "repromptText": repromptText
                    };
                callback(sessionAttributes,buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));   
            }
        );
       
    }
    function handleAccountListRequestException(intent, session, callback) {
        
        var speechOutput = "ExceptionSpeechOutput"; 
        var repromptText = "ExceptionRepromptText";
        
        
        callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false)); 
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


    function handleAnswerRequest(intent, session, callback) {
        var speechOutput = "";
        var repromptText = "";
        var sessionAttributes = {};
        var gameInProgress = session.attributes && session.attributes.questions;
        var noIndent = intent.name === "DontKnowIntent";
        var currency = intent.slots.CURRENCY.value.toUpperCase();
        
        
        if (noIndent) {
            speechOutput = "Please tell me again.";

            callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, "", true));
        } else {
            speechOutput = "The requested intend name is " + intent.name;
            repromptText = session.sessionId + " " + session.attributes;
            
            callback(sessionAttributes,
                    buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));             
        }
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
 
var options = {
  host: 'idtst.shinhanglobal.com',
  path: '/global_api/exchangerate',
  port: '443',
  method: 'GET'
};

function getQuote(callback) {
    https.get(options, function(res) {        
            res.on("data", function(chunk) {
            var text = '' + chunk;
            return callback(text);
        });
    }).on('error', function(e) {
        text = 'error' + e.message;
    });
}


function doE2022(token, personalKey, callback) {
    console.log(">>>>>>>>>>E2022>>>>>>>>>>>")
    var token = token;
    var personalKey = personalKey;

    if(!token || !personalKey) {
        console.log(">>>>>>>>>input access token or personalKey");
        return;
    }
    console.log(">>>>>>>personalKey "+personalKey)
    var options = {
        host:  'satst.shinhanglobal.com',
        port: null,
        path: '/global_api/account/list',
        method: 'POST',
        headers: {
            'X-GLOBAL-ClientId' : 'alexa72991770421',
            'X-GLOBAL-ClientSecret' : 'e6797bcf5bd14617bec0ed878d170056',
            'X-GLOBAL-AccessToken' : token,
            'X-GLOBAL-PersonalKey' : personalKey
        }
    };
    console.log(">>>>post_options>>"+options.headers);

    var req = https.request(options, function (res) {
      var chunks = "";
      console.log(">>>>>>>>>req");
      res.on("data", function (chunk) {
          chunks += chunk
          console.log(">>>>>>>>>chunk "+ chunk);
      });

      res.on("end", function () {
        callback(chunks);
      });
    });
    req.end();
}  

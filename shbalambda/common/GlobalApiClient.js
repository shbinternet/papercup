'use strict';

/*==============================================================================
 * FILE NAME : GlobalApiClient.js
 * DISCRIPTION : open API 송신을 위한 통신객체
 *------------------------------------------------------------------------------
 *------------------------------------------------------------------------------
 * DATE			AUTHOR	CONTENT    
 *------------------------------------------------------------------------------
 * 2017-09-25	고동환	최초작성
 *=============================================================================*/

const Https = require('https');

class GlobalApiClient {

    /**
     * 송신데이터 정의
     * @param domain : 송신대상 domain
     * @param path : API 경로
     * @param accessToken : oAuth 2.0 accessToken
     * @param personKey : 중요거래시 사용되는 개인키
     * @param personKey : 송신데이터 (Json Data 정의)
     */
    constructor(data) {
        console.log("Creating GlobalApiClient instance.");
        this.domain = data.domain.replace(/^https?:\/\//i, "");        
        this.path = data.path;
        this.accessToken = data.accessToken;
        this.personKey =  data.personKey;
        this.sndData = data.sndData;
    }

    /**
     * API 송신 Function
     * @return {Promise} API 호출후 응답 response 객체.
     */
    getGlobalApi() {
        const options = this.__getRequestOptions();       
        
        return new Promise((fulfill, reject) => {
            this.__handleGlobalApiRequest(options, fulfill, reject);
        });
    }   
    
    /**
     * API 송신 Function
     * This is a helper method that makes requests to the Address API and handles the response
     * in a generic manner. It will also resolve promise methods.
     * @param requestOptions
     * @param fulfill
     * @param reject
     * @private
     */
    __handleGlobalApiRequest(requestOptions, fulfill, reject) {
        let req = Https.request(requestOptions, (response) => {
			            console.log(`GlobalApi API responded with a status code of : ${response.statusCode}`);
			
			            response.on('data', (data) => {			            	            	
//console.log('GlobalApi API responded with a status code of :' + data);			            	
			                let responsePayloadObject = JSON.parse(data);			
			                const globalApiResponse = {
			                    statusCode: response.statusCode,
			                    reqData: responsePayloadObject
			                };
			
			                fulfill(globalApiResponse);
			            });
			        });
/*
        req.setTimeout(30000,function () {
        	  req.abort();
        	  console.log("timeout");
        });        
*/                
        req.on('error', (e) => {
            console.error("GlobalApiClient Error==>" + e);
            reject();
        });    
        
        req.write(JSON.stringify(this.sndData));
        req.end();
    }

    /**
     * 송신데이터 option 정의
     * @param path the path that you want to hit against the API provided by the skill event.
     * @return {{hostname: string, path: *, method: string, headers: {Authorization: string}}}
     * @private
     */
    __getRequestOptions() {
        return {
            hostname: this.domain,
            path: this.path,
            method: 'POST',
            'headers': {
            	'Content-Type': 'application/json',
                'X-GLOBAL-ClientId': 'alexa72991770421',
                'X-GLOBAL-ClientSecret': 'e6797bcf5bd14617bec0ed878d170056',
                'X-GLOBAL-AccessToken': this.accessToken,
                'X-GLOBAL-PersonalKey': this.personKey
            }
        };
    }
}

module.exports = GlobalApiClient;
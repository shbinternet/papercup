'use strict';

const Https = require('https');

/**
 * This is a small wrapper client for the Alexa Address API.
 */
class GlobalApiClient {

    /**
     * Retrieve an instance of the Address API client.
     * @param domain the endpoint of the Alexa APIs.
     * @param path the device ID being targeted.
     * @param consentToken valid consent token.
     */
    constructor(data) {
        console.log("D.H.Koh Debug Creating GlobalApiClient instance.");
        this.endpoint = data.domain.replace(/^https?:\/\//i, "");        
        this.path = data.path;
        this.accessToken = data.accessToken;
        this.personKey =  data.personKey;
        //this.sndData = data.sndData;
    }

    /**
     * This will make a request to the Address API using the device ID and
     * consent token provided when the Address Client was initialized.
     * This will retrieve the full address of a device.
     * @return {Promise} promise for the request in flight.
     */
    getGlobalApi() {
        const options = this.__getRequestOptions(this.path);

        return new Promise((fulfill, reject) => {
            this.__handleGlobalApiRequest(options, fulfill, reject);
        });
    }

    /**
     * This is a helper method that makes requests to the Address API and handles the response
     * in a generic manner. It will also resolve promise methods.
     * @param requestOptions
     * @param fulfill
     * @param reject
     * @private
     */
    __handleGlobalApiRequest(requestOptions, fulfill, reject) {
        Https.get(requestOptions, (response) => {
            console.log(`Device Address API responded with a status code of : ${response.statusCode}`);

            response.on('data', (data) => {
            	
console.log("D.H.Koh Debug response.on" + data);            	
            	
                let responsePayloadObject = JSON.parse(data);

                const deviceAddressResponse = {
                    statusCode: response.statusCode,
                    reqData: responsePayloadObject
                };

                fulfill(deviceAddressResponse);
            });
        }).on('error', (e) => {
            console.error("D.H.Koh Debug Error==>" + e);
            reject();
        });
    }

    /**
     * Private helper method for retrieving request options.
     * @param path the path that you want to hit against the API provided by the skill event.
     * @return {{hostname: string, path: *, method: string, headers: {Authorization: string}}}
     * @private
     */
    __getRequestOptions(path) {
        return {
            hostname: this.endpoint,
            path: this.path,
            method: 'POST',
            'headers': {
                'X-GLOBAL-ClientId': 'alexa72991770421',
                'X-GLOBAL-ClientSecret': 'e6797bcf5bd14617bec0ed878d170056',
                'X-GLOBAL-AccessToken': this.accessToken,
                'X-GLOBAL-PersonalKey': this.personKey
            }
        };
    }
}

module.exports = GlobalApiClient;
'use strict';

const Https = require('https');
/**
 * This is a small wrapper client for the Alexa Address API.
 */
class AlexaAPIClient {

    /**
     * Retrieve an instance of the Address API client.
     * @param path the path of the Alexa APIs.
     * @param personalKey valid personalKey
     */
    
    constructor(path, personalKey) {
        console.log("Creating AlexaAPIClient instance.");
        this.path = path;
        this.personalKey = personalKey;
    }

    /**
     * This will make a request to the Address API using the device ID and
     * consent token provided when the Address Client was initialized.
     * This will retrieve the full address of a device.
     * @return {Promise} promise for the request in flight.
     */
    getCurrencyRate(currency, date) {
        var detailPath = '?date='+date+'&ccy='+currency;
        const options ={
            host: 'satst.shinhanglobal.com',
            path: '/global_api/exchangerate'+detailPath,
            method: 'GET'
        }
        return this.__handleGlobalApiRequest(options);
    }

    postAccountList(){
        const options={            
            host: 'satst.shinhanglobal.com',
            path: 'global_api/account/list',
            method: 'POST',
            headers: {
             'X-GLOBAL-ClientId' : 'alexa72991770421',
             'X-GLOBAL-ClientSecret' : 'e6797bcf5bd14617bec0ed878d170056',
             'X-GLOBAL-AccessToken' : this.accessTocken,
             'X-GLOBAL-PersonalKey' : this.personalKey
             }        
            
        }
        return this.__handleGlobalApiRequest(options);
    }

    /**
     * This is a helper method that makes requests to the Address API and handles the response
     * in a generic manner. It will also resolve promise methods.
     * @param requestOptions
     * @param fulfill
     * @param reject
     * @private
     */
    __handleGlobalApiRequest(requestOptions) {
        Https.get(requestOptions, (response) => {
            console.log(`Device Address API responded with a status code of : ${response.statusCode}`);

            response.on('data', (data) => {
                let responsePayloadObject = JSON.parse(data);

                const deviceresponse = {
                    statusCode: response.statusCode,
                    address: responsePayloadObject
                };
            });
        }).on('error', (e) => {
            console.log(">>>>>>>>>apiRequest error");
            console.error(e);
        });
    }
}

module.exports = AlexaAPIClient;
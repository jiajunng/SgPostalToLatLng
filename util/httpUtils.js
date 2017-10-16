let http = require('http');
// let httpUtil = function(endpoint, payload){
//     this.endpoint = endpoint;
//     this.payload = payload;
// }
let httpUtil = function(){

}

httpUtil.postRequest = function(endpoint)
{

    return new Promise(function(resolve, reject){

        let req = http.get(endpoint, function(response) {
            // console.log('STATUS: ' + response.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(response.headers));

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            response.on('data', function(chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function() {
                // var body = Buffer.concat(bodyChunks);
                resolve(JSON.parse(bodyChunks.join('')));

                // ...and/or process the entire body here.
            })
        });
        req.on('error', function(e) {
            console.log('ERROR: ' + e.message);
            reject(e)
        });



    })

}


module.exports = httpUtil;

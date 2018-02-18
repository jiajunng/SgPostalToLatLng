var express = require('express');
var router = express.Router();
var httpUtil = require('../util/httpUtils');248369
// const onemapGeocodeEP = "http://developers.onemap.sg/commonapi/convert/3414to4326?";
const onemapGeocodeEP =  "http://developers.onemap.sg/commonapi/search?searchVal="
const epParams = "&returnGeom=Y&getAddrDetails=Y&pageNum=1";
router.get('/', function (req, res, next) {

    console.log(req.body)
});

router.post('/post', function (req, res, next) {
    function callback(dataPoints) {
        console.log("response")
        res.send({"results": dataPoints});
    }

    let dataPoints = req.body.datapoints;
    sendRequests(dataPoints, 0, 0, [], callback)

});
function sendRequests(data, responseCount, index, datapointArray, callback) {
    if (responseCount >= data.length) {
        callback(datapointArray);
    }
    var testpcost =  data[index].postal;
    var test = onemapGeocodeEP + data[index].postal+epParams;
    httpUtil.postRequest(test)
        .then(function (success) {
            let results = success.results[0]
            if(results!==undefined)
            {
                let address = results.ADDRESS;
                let postal = results.POSTAL;
                let lat = results.LATITUDE;
                let long = results.LONGITUDE;
                console.log(success);
                datapointArray.push({
                    "postal": postal,
                    "lat": lat,
                    "long": long,
                    "addr" : address,

                })
            }


            responseCount++;
            index++
            sendRequests(data, responseCount, index, datapointArray, callback)

        }, function (failure) {


            datapointArray.push({
                "postal": data[index].postal,
                "msg": "failed to geocode"
            })
            responseCount++;
            index++
            sendRequests(data, responseCount, index, datapointArray, callback)

        })


}

module.exports = router;

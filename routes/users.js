var express = require('express');
var router = express.Router();
var httpUtil = require('../util/httpUtils');
const onemapGeocodeEP = "http://developers.onemap.sg/commonapi/convert/3414to4326?";
/* GET users listing. */
router.get('/', function (req, res, next) {

    console.log(req.body)
});

router.post('/post', function (req, res, next) {
    function callback(dataPoints) {
        console.log("response")
        res.send({"results" : dataPoints});
    }
    let dataPoints = req.body.datapoints;
    sendRequests(dataPoints, 0, 0, [], callback)

});
function sendRequests(data, responseCount, index, datapointArray, callback) {
    if (responseCount >= data.length) {
        callback(datapointArray);
    }

    httpUtil.postRequest(onemapGeocodeEP + "X=" + data[index].X + "&Y=" + data[index].Y)
        .then(function (success) {

           datapointArray.push({
                "postal": data[index].PostalCode,
                "lat": success.latitude,
                "long": success.longitude
            })
            responseCount++;
            index++
            sendRequests(data, responseCount, index, datapointArray, callback)

        }, function (failure) {


            datapointArray.push({
                "postal": data[index].postal,
                "msg" : "failed to geocode"
            })
            responseCount++;
            index++
            sendRequests(data, responseCount, index, datapointArray, callback)

        })

}

module.exports = router;

const axios = require('axios');

//= =======================================
// Connection Route
//= =======================================
exports.Connection = function (req, res, next) {
    console.log('connecting...');
    var route = req.body.route;
    var data = req.body.content;//'<?xml version="1.0" encoding="utf-8"?><Communication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><Command SequenceId="1"><Type>Request</Type><Name>Connect</Name><InputParams><Param Name="ProcessingMessage" Value="No" /><Param Name="PublicKey" Value="Uenetb3mWceZrqTw0sArwktxItWiDuNfblZnRQ2dhTZ0Mo5rOVF+3nDj94Q8wUa7R7rv71YLXs91AcxM4oFWrJnPHCcKd4Qi8DZlgpReKSCFKbk8+NVGSg/PF6eNHBwoRsZXsS0RMBEME1GFnO33rVqqzvz/TPppx7tymoCyn5AA" /></InputParams></Command></Communication>\n'
    var responseType = req.body.responseType;
    var contentType = req.body.contentType;
    axios.post('http://192.168.1.102:8081/' + route,
        data,
        {
            responseType: responseType,
            headers:{
                'Content-Type': contentType
            }
        }).then(response => {
            if(typeof data === 'string' && data.search('Upload') > 0){
                console.log('VideoPushResponse: ', response.data)
            }
            let result = response.data;
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
            res.header('Content-Type', 'text/xml; charset=utf-8')
            res.status(200).send(result);
        }).catch(error => {
            console.log(error);
        });
};

const DeviceAttributesModel = require('../models').DeviceAttributes;

//= =======================================
// Deck Route
//= =======================================
exports.getAllDeviceAttributes = function (req, res, next) {
    console.log('connecting...');
    DeviceAttributesModel.findAll({
        attributes:
            [
                'AttributeID',
                'AttributeNameID',
                'AttributeValue',
                'SecurityDeviceID',
                'AuxiliaryDeviceID'
            ]
    }).then( deviceAttributes => {
        res.status(200).send(deviceAttributes);
    }).catch( error =>{
        console.log('error: ', 'DeviceAttribute not found.');
        res.status(404).send('DeviceAttribute not found');
    })
};

exports.getDeviceAttributeBySecurityDeviceID = function (req, res, next) {
    console.log('connecting...');
    let { SecurityDeviceID } = req.query;
    console.log(req.query)
    if( SecurityDeviceID !== undefined ) {
        DeviceAttributesModel.findOne({
            where: { SecurityDeviceID: SecurityDeviceID },
            attributes: ['AttributeID',
                'AttributeNameID',
                'AttributeValue',
                'SecurityDeviceID',
                'AuxiliaryDeviceID']
        }).then( deviceAttribute => {
            res.status(200).send(deviceAttribute);
        }).catch( error =>{
            console.log('error: ', 'DeviceAttribute not found.');
            res.status(404).send('DeviceAttribute not found');
        })
    } else {
        console.log('error: ', 'Invalid Params.');
        res.status(404).send('Invalid Params');
    }
};

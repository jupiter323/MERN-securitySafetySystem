const AuxDevicesModel = require('../models').AuxiliaryDevices;

//= =======================================
// Deck Route
//= =======================================
exports.getAllAuxiliaryDevcies = function (req, res, next) {
    console.log('connecting...');
    AuxDevicesModel.findAll({
        attributes:
            [
                'AuxDeviceID',
                'AuxDeviceName',
                'AuxEquipmentTypeID',
                'AuxEquipmentSubTypeID',
                'ClearanceLevelID',
                'AuxDeviceSensorID'
            ]
    }).then( auxDevices => {
        res.status(200).send(auxDevices);
    }).catch( error =>{
        console.log('error: ', 'AuxiliaryDevices not found.', error);
        res.status(404).send('AuxiliaryDevices not found');
    })
};

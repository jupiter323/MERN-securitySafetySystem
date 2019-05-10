const DeviceModel = require('../models').SecurityDevices;
const AuxDevicesModel = require('../models').AuxiliaryDevices;

//= =======================================
// Deck Route
//= =======================================
exports.getAllDevices = function (req, res, next) {
    console.log('connecting...');
    DeviceModel.belongsTo(AuxDevicesModel, {
        foreignKey: 'AuxDeviceID',
        targetKey: 'AuxDeviceID',
        constraints: false
    });
    DeviceModel.findAll({
        include: [{
            model: AuxDevicesModel,
            attributes:
                [
                    'AuxDeviceID',
                    'AuxDeviceName',
                    'AuxEquipmentTypeID',
                    'AuxEquipmentSubTypeID',
                    'ClearanceLevelID',
                    'AuxDeviceSensorID'
                ],
            required: true
        }],
        attributes: ['DeviceID',
            'DeviceName',
            'DeviceGUID',
            'EquipmentTypeID',
            'EquipmentSubTypeID',
            'AuxDeviceID',
            'ClearanceLevelID',
            'LocationID']
    }).then( devices => {
        res.status(200).send(devices);
    }).catch( error =>{
        console.log('error: ', 'Devices not found.');
        res.status(404).send('Devices not found');
    })
};

exports.getDeviceById = function (req, res, next) {
    console.log('connecting...');
    let { DeviceID } = req.query;
    if( DeviceID !== undefined ) {
        DeviceModel.findOne({
            where: { DeviceID: DeviceID },
            attributes: ['DeviceID',
                'DeviceName',
                'DeviceGUID',
                'EquipmentTypeID',
                'EquipmentSubTypeID',
                'AuxDeviceID',
                'ClearanceLevelID',
                'LocationID']
        }).then( device => {
            res.status(200).send(device);
        }).catch( error =>{
            console.log('error: ', 'Deck not found.');
            res.status(404).send('Deck not found');
        })
    } else {
        console.log('error: ', 'Invalid Params.');
        res.status(404).send('Invalid Params');
    }
};
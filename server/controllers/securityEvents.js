const SecurityEventsModel = require('../models').SecurityEvents;
const DevicesModel = require('../models').SecurityDevices;
const DeckLocationsModel = require('../models').DeckLocations;
const UserModel = require('../models').UserPasswords;
const EventAttributesModel = require('../models').EventAttributes;
//= =======================================
// Deck Route
//= =======================================
exports.getAllSecurityEvents = function (req, res, next) {
    console.log('connecting...');
    SecurityEventsModel.findAll({
        attributes:
            [
                'EventID',
                'DateTime',
                'DeviceID',
                'EventMsg',
                'CurrentSecurityLevel',
                'ShowEvent'
            ],
        order: [
            ['Datetime', 'DESC']
        ]
    }).then( securityEvents => {
        res.status(200).send(securityEvents);
    }).catch( error =>{
        console.log('error: ', 'SecurityEvents not found.');
        res.status(404).send('SecurityEvents not found');
    })
};

exports.getAllEventsLogs = function (req, res, next) {
    console.log('connecting...');
    let limit = req.query.limit;
    let offset = req.query.offset;
    let sortType = req.query.sortType;
    let order = parseInt(req.query.order);
    SecurityEventsModel.belongsTo(DevicesModel, {foreignKey: {name: 'DeviceID', allowNull: false}});
    DevicesModel.belongsTo(DeckLocationsModel, {foreignKey: {name: 'LocationID', allowNull: false}});
    let option = {
        offset: offset,
        limit: limit,
        include: [{
            model: DevicesModel,
            attributes: ['DeviceID', 'DeviceName'],
            required: true,
            include: [{
                model: DeckLocationsModel,
                attributes: ['LocationName'],
                required: true
            }]
        }],
        attributes: [
            'DeviceID',
            'EventID',
            'DateTime',
            'EventMsg'
        ]
    };
    switch (sortType) {
        case 'datetime': {
            console.log('order: ', order, option)
            option.order = [['DateTime', (order === 0)?'DESC':'ASC']];
            break;
        }
        case 'eventType': {
            option.order = [['EventMsg', (order === 0)?'DESC':'ASC']];
            break;
        }
        case 'device': {
            option.order = [[{model: DevicesModel}, 'DeviceName', (order === 0)?'DESC':'ASC']];
            break;
        }
        case 'location': {
            option.order = [[{model: DevicesModel}, {model: DeckLocationsModel}, 'LocationName', (order === 0)?'DESC':'ASC']];
            break;
        }
    }

    SecurityEventsModel.findAll(option).then( securityEvents => {
        console.log("Result: ", securityEvents.length);
        res.status(200).send(securityEvents);
    }).catch( error =>{
        console.log('error: ', 'SecurityEvents not found.', error);
        res.status(404).send('SecurityEvents not found');
    });
};

exports.getEventsLogCount = function (req, res, next) {
    console.log('connecting...');
    SecurityEventsModel.count().then( count => {
        res.status(200).send({count: count});
    }).catch( error =>{
        res.status(404).send('SecurityEvents not found', error);
    });

};

exports.updateEventLogs = function (req, res, next) {
    console.log('connecting...');
    let latest = req.query.latest;
    const { Op } = require('sequelize');
    console.log("limit:", latest);
    SecurityEventsModel.belongsTo(DevicesModel, {foreignKey: {name: 'DeviceID', allowNull: false}});
    DevicesModel.belongsTo(DeckLocationsModel, {foreignKey: {name: 'LocationID', allowNull: false}});
    SecurityEventsModel.findAll({
        include: [{
            model: DevicesModel,
            attributes: ['DeviceID', 'DeviceName'],
            required: true,
            include: [{
                model: DeckLocationsModel,
                attributes: ['LocationName'],
                required: true
            }]
        }],
        attributes:
            [
                'DeviceID',
                'EventID',
                'DateTime',
                'EventMsg'
            ],
        order: [
            ['Datetime', 'DESC'],
        ],
        where: {
            'DateTime': {[Op.gt]: new Date(latest)}
        }
    }).then( securityEvents => {
        console.log("Result: ", securityEvents.length);
        res.status(200).send(securityEvents);
    }).catch( error =>{
        console.log('error: ', 'SecurityEvents not found.', error);
        res.status(404).send('SecurityEvents not found');
    });
};

exports.getSecurityEventsByDeviceId = function (req, res, next) {
    console.log('connecting...');
    let { DeviceID, limit, offset, sortType, order } = req.query;
    order = parseInt(order);
    SecurityEventsModel.belongsTo(EventAttributesModel, {
        foreignKey: 'EventID',
        targetKey: 'EventID',
        constraints: false
    });
    EventAttributesModel.belongsTo(UserModel, {
        foreignKey: 'AttributeValueString',
        targetKey: 'Username',
        constraints: false
    });
    let option = {
        offset: offset,
        limit: limit,
        include: [{
            model: EventAttributesModel,
            attributes: ['AttributeValueString'],
            required: true,
            include: [{
                model: UserModel,
                attributes: ['UserID', 'UserSecurityClearance_ClearanceID'],
                required: true
            }]
        }],
        where: { DeviceID: DeviceID },
        attributes: [
            'DateTime',
            'EventID',
            'EventMsg'
        ],
        order: [['DateTime', 'DESC']]
    };
    /*switch (sortType) {
        case 'datetime': {
            console.log('order: ', order, option)
            option.order = [['DateTime', (order === 0)?'DESC':'ASC']];
            break;
        }
        case 'eventType': {
            option.order = [['EventMsg', (order === 0)?'DESC':'ASC']];
            break;
        }
        case 'device': {
            option.order = [[{model: DevicesModel}, 'DeviceName', (order === 0)?'DESC':'ASC']];
            break;
        }
        case 'location': {
            option.order = [[{model: DevicesModel}, {model: DeckLocationsModel}, 'LocationName', (order === 0)?'DESC':'ASC']];
            break;
        }
    }*/

    if( DeviceID !== undefined ) {
        SecurityEventsModel.findAll(option).then( events => {
            res.status(200).send(events);
        }).catch( error =>{
            console.log('error: ', 'SecurityEvent not found.');
            res.status(404).send('SecurityEvent not found');
        })
    } else {
        console.log('error: ', 'Invalid Params.');
        res.status(404).send('Invalid Params');
    }
};

exports.getEventsLogCountByDeviceId = function (req, res, next) {
    console.log('connecting...');
    let { DeviceID } = req.query;
    console.log("DeviceId : ", DeviceID)
    SecurityEventsModel.count({
        where: [{ DeviceID: DeviceID }],
    }).then( count => {
        res.status(200).send({count: count});
    }).catch( error =>{
        res.status(404).send('SecurityEvents not found', error);
    });

};

exports.getEventsLogsByCameraId = function (req, res, next) {
    console.log('connecting...');
    let limit = req.query.limit;
    let offset = req.query.offset;
    let sortType = req.query.sortType;
    let order = parseInt(req.query.order);
    let cameraId = req.query.cameraId;
    SecurityEventsModel.belongsTo(DevicesModel, {foreignKey: {name: 'DeviceID', allowNull: false}});
    DevicesModel.belongsTo(DeckLocationsModel, {foreignKey: {name: 'LocationID', allowNull: false}});
    let option = {
        offset: offset,
        limit: limit,
        include: [{
            model: DevicesModel,
            attributes: ['DeviceID', 'DeviceName'],
            required: true,
            include: [{
                model: DeckLocationsModel,
                attributes: ['LocationName'],
                required: true
            }]
        }],
        attributes: [
            'DeviceID',
            'EventID',
            'DateTime',
            'EventMsg'
        ],
        where: { DeviceID: cameraId }
    };
    switch (sortType) {
        case 'datetime': {
            option.order = [['DateTime', (order === 0)?'DESC':'ASC']];
            break;
        }
        case 'eventType': {
            option.order = [['EventMsg', (order === 0)?'DESC':'ASC']];
            break;
        }
        case 'device': {
            option.order = [[{model: DevicesModel}, 'DeviceName', (order === 0)?'DESC':'ASC']];
            break;
        }
        case 'location': {
            option.order = [[{model: DevicesModel}, {model: DeckLocationsModel}, 'LocationName', (order === 0)?'DESC':'ASC']];
            break;
        }
    }

    SecurityEventsModel.findAll(option).then( securityEvents => {
        console.log("Result: ", securityEvents.length);
        res.status(200).send(securityEvents);
    }).catch( error =>{
        console.log('error: ', 'SecurityEvents not found.', error);
        res.status(404).send('SecurityEvents not found');
    });
};

exports.getEventsLogCountByCameraId = function (req, res, next) {
    console.log('connecting...');
    let cameraId = req.query.cameraId;
    SecurityEventsModel.count({where: { DeviceID: cameraId }}).then( count => {
        res.status(200).send({count: count});
    }).catch( error =>{
        res.status(404).send('SecurityEvents not found', error);
    });

};

exports.updateCameraEventLogs = function (req, res, next) {
    console.log('connecting...');
    let latest = req.query.latest;
    let cameraId = req.query.cameraId;
    const { Op } = require('sequelize');
    console.log("limit:", latest);
    SecurityEventsModel.belongsTo(DevicesModel, {foreignKey: {name: 'DeviceID', allowNull: false}});
    DevicesModel.belongsTo(DeckLocationsModel, {foreignKey: {name: 'LocationID', allowNull: false}});
    SecurityEventsModel.findAll({
        include: [{
            model: DevicesModel,
            attributes: ['DeviceID', 'DeviceName'],
            required: true,
            include: [{
                model: DeckLocationsModel,
                attributes: ['LocationName'],
                required: true
            }]
        }],
        attributes:
            [
                'DeviceID',
                'EventID',
                'DateTime',
                'EventMsg'
            ],
        order: [
            ['Datetime', 'DESC'],
        ],
        where: {
            'DateTime': {[Op.gt]: new Date(latest)},
            DeviceID: cameraId
        }
    }).then( securityEvents => {
        console.log("Result: ", securityEvents.length);
        res.status(200).send(securityEvents);
    }).catch( error =>{
        console.log('error: ', 'SecurityEvents not found.', error);
        res.status(404).send('SecurityEvents not found');
    });
};
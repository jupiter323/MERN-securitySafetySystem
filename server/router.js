const AuthController = require('./controllers/authentication');
const DecksController = require('./controllers/decksController');
const DeviceController = require('./controllers/devicesController');
const DeckLocationController = require('./controllers/deckLocationsController');
const AttributeNamesController = require('./controllers/attributeNames');
const EventAttributesController = require('./controllers/eventAttributes');
const SecurityEventsController = require('./controllers/securityEvents');
const DeviceAttributesController = require('./controllers/deviceAttributes');
const DeckZonesController = require('./controllers/deckZones');
const AuxiliaryDevicesController = require('./controllers/auxDevicesController');
const GraphQlController =  require('./controllers/GraphQlController');
const express = require('express');

module.exports = function (app) {
    // Initializing route groups
    //console.log("starting now...");
    const apiRoutes = express.Router(),
        graphRoutes = express.Router(),
        authRoutes = express.Router(),
        decksRoutes = express.Router(),
        usersRoutes = express.Router(),
        deviceRoutes = express.Router(),
        attributeNamesRoutes = express.Router(),
        securityEventsRoutes = express.Router(),
        eventAttributesRoutes = express.Router(),
        deviceAttributesRoutes = express.Router(),
        deckLocationRoutes = express.Router(),
        deckZonesRoutes = express.Router(),
        auxDevicesRoutes = express.Router();


    //= ========================
    // User Routes
    //= ========================
    graphRoutes.use('/', GraphQlController.getGraphQl);

    //= ========================
    // User Routes
    //= ========================
    apiRoutes.use('/auth', authRoutes);

    //Login User
    authRoutes.post('/login', AuthController.login);

    //= ========================
    // Users Routes
    //= ========================
    apiRoutes.use('/users', usersRoutes);

    //Get All Users
    //decksRoutes.get('/all', AuthController.getUserByName());

    //Get User By Username
    usersRoutes.get('/', AuthController.getUserByName);

    //= ========================
    // Decks Routes
    //= ========================
    apiRoutes.use('/decks', decksRoutes);

    //Get All Decks
    decksRoutes.get('/all', DecksController.getAllDecks);

    //Get Deck By DeckNumber
    decksRoutes.get('/id', DecksController.getDeckById);

    //= ========================
    // SecurityDevies Routes
    //= ========================
    apiRoutes.use('/devices', deviceRoutes);

    //Get All SecurityDevices
    deviceRoutes.get('/all', DeviceController.getAllDevices);

    //Get SecurityDevice By DeviceID
    deviceRoutes.get('/id', DeviceController.getDeviceById)

    //= ========================
    // DeckLocation Routes
    //= ========================
    apiRoutes.use('/deckLocations', deckLocationRoutes);

    //Get All DeckLocations
    deckLocationRoutes.get('/all', DeckLocationController.getAllDeckLocations);

    //= ========================
    // AttributeNames Routes
    //= ========================
    apiRoutes.use('/attributeNames', attributeNamesRoutes);

    //Get All AttributeNames
    attributeNamesRoutes.get('/all', AttributeNamesController.getAllAttributesNames);

    //= ========================
    // EventAttributes Routes
    //= ========================
    apiRoutes.use('/eventAttributes', eventAttributesRoutes);

    //Get All EventAttributes
    eventAttributesRoutes.get('/all', EventAttributesController.getAllEventAttributes);

    //Get EventAttribute by DeviceId
    eventAttributesRoutes.get('/', EventAttributesController.getEventAttributeByEventId);

    //= ========================
    // SecurityEvents Routes
    //= ========================
    apiRoutes.use('/securityEvents', securityEventsRoutes);

    //Get All SecurityEvents
    securityEventsRoutes.get('/all', SecurityEventsController.getAllSecurityEvents);

    //Get All EventLogs
    securityEventsRoutes.get('/allEventLogs', SecurityEventsController.getAllEventsLogs);

    //Update EventLogs EventLogs
    securityEventsRoutes.get('/updateEventLogs', SecurityEventsController.updateEventLogs);

    //Get EventLog Count
    securityEventsRoutes.get('/count', SecurityEventsController.getEventsLogCount);

    //Get SecurityEvents by DeviceId
    securityEventsRoutes.get('/getEventsByDeviceId', SecurityEventsController.getSecurityEventsByDeviceId);

    //Get SecurityEvents Count by DeviceId
    securityEventsRoutes.get('/getCountByDeviceId', SecurityEventsController.getEventsLogCountByDeviceId);

    //Get SecurityEvents by CameraId
    securityEventsRoutes.get('/eventLogsByCameraId', SecurityEventsController.getEventsLogsByCameraId);

    //Get SecurityEvents Count by CameraId
    securityEventsRoutes.get('/countByCameraId', SecurityEventsController.getEventsLogCountByCameraId);

    //Update Camera EventLogs
    securityEventsRoutes.get('/updateCameraEventLogs', SecurityEventsController.updateCameraEventLogs);

    //= ========================
    // DeviceAttributes Routes
    //= ========================
    apiRoutes.use('/deviceAttributes', deviceAttributesRoutes);

    //Get All SecurityEvents
    deviceAttributesRoutes.get('/all', DeviceAttributesController.getAllDeviceAttributes);

    //Get DeviceAttribute by SecurityDeviceID
    deviceAttributesRoutes.get('/', DeviceAttributesController.getDeviceAttributeBySecurityDeviceID);

    //= ========================
    // DeckZones Routes
    //= ========================
    apiRoutes.use('/deckZones', deckZonesRoutes);

    //Get All SecurityEvents
    deckZonesRoutes.get('/all', DeckZonesController.getAllDeckZones);

    deckZonesRoutes.get('/location/secdevices/senors', DeckZonesController.getAllDeckSensorsZones)

    //= ========================
    // Auxiliary Devices Routes
    //= ========================
    apiRoutes.use('/auxDevices', auxDevicesRoutes);

    //Get All Auxiliary Devices
    auxDevicesRoutes.get('/all', AuxiliaryDevicesController.getAllAuxiliaryDevcies);

    app.use('/api', apiRoutes);
    app.use('/graphql', graphRoutes);

};

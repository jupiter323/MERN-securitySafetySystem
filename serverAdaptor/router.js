const AdapterController = require('./controllers/adapter');

const express = require('express');

module.exports = function (app) {
    // Initializing route groups
    //console.log("starting now...");
    const connectionRoutes = express.Router();

    //= ========================
    // Adapter Routes
    //= ========================
    connectionRoutes.post('/connection', AdapterController.Connection);

    app.use('/adaptor', connectionRoutes);

};

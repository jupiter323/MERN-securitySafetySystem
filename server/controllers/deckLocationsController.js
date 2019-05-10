const DeckLocationsModel = require('../models').DeckLocations;

//= =======================================
// Deck Route
//= =======================================
exports.getAllDeckLocations = function (req, res, next) {
    console.log('connecting...');
    DeckLocationsModel.findAll({
        attributes:
            [
                'LocationID',
                'LocationName',
                'LocationX',
                'LocationY',
                'DeckZoneID',
                'DeckNumber'
            ]
    }).then( locations => {
        res.status(200).send(locations);
    }).catch( error =>{
        console.log('error: ', 'DeckLocation not found.');
        res.status(404).send('DeckLocation not found');
    })
};

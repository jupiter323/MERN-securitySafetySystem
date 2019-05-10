const DecksModel = require('../models').Decks;

//= =======================================
// Deck Route
//= =======================================
exports.getAllDecks = function (req, res, next) {
    console.log('connecting...');
    DecksModel.findAll({
        attributes: ['DeckNumber', 'DeckName']
    }).then( decks => {
        res.status(200).send(decks);
    }).catch( error =>{
        console.log('error: ', 'Deck not found.');
        res.status(404).send('Deck not found');
    })
};

exports.getDeckById = function (req, res, next) {
    console.log('connecting...');
    let { DeckNumber } = req.query;
    if( DeckNumber !== undefined ) {
        DecksModel.findOne({
            where: { DeckNumber: DeckNumber },
            attributes: ['DeckNumber', 'DeckName']
        }).then( deck => {
            res.status(200).send(deck);
        }).catch( error =>{
            console.log('error: ', 'Deck not found.');
            res.status(404).send('Deck not found');
        })
    } else {
        console.log('error: ', 'Invalid Params.');
        res.status(404).send('Invalid Params');
    }
};
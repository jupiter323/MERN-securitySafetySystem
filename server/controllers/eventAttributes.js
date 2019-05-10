const EventAttributesModel = require('../models').EventAttributes;

//= =======================================
// Deck Route
//= =======================================
exports.getAllEventAttributes = function (req, res, next) {
    console.log('connecting...');
    EventAttributesModel.findAll({
        attributes:
            [
                'EventAttributeID',
                'EventID',
                'AttributeNameID',
                'AttributeValueString',
                'AttributeValueDataTypeID'
            ]
    }).then( eventAttributes => {
        res.status(200).send(eventAttributes);
    }).catch( error =>{
        console.log('error: ', 'EventAttributes not found.');
        res.status(404).send('EventAttributes not found');
    })
};

exports.getEventAttributeByEventId = function (req, res, next) {
    console.log('connecting...');
    let { EventID } = req.query;
    console.log(req.query)
    if( EventID !== undefined ) {
        EventAttributesModel.findOne({
            where: { EventID: EventID },
            attributes: ['EventAttributeID',
                'EventID',
                'AttributeNameID',
                'AttributeValueString',
                'AttributeValueDataTypeID']
        }).then( eventAttribute => {
            res.status(200).send(eventAttribute);
        }).catch( error =>{
            console.log('error: ', 'EventAttribute not found.');
            res.status(404).send('EventAttribute not found');
        })
    } else {
        console.log('error: ', 'Invalid Params.');
        res.status(404).send('Invalid Params');
    }
};


const AttributeNamesModel = require('../models').AttributeNames;

//= =======================================
// Deck Route
//= =======================================
exports.getAllAttributesNames = function (req, res, next) {
    console.log('connecting...');
    AttributeNamesModel.findAll({
        attributes:
            [
                'AttributeNameID',
                'AttributeName'
            ]
    }).then( attributeNames => {
        res.status(200).send(attributeNames);
    }).catch( error =>{
        console.log('error: ', 'AttributeNames not found.');
        res.status(404).send('AttributeName not found');
    })
};

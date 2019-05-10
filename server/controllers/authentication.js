const jwt = require('jsonwebtoken');
const UserModel = require('../models').UserPasswords;
const setUserInfo = require('../helpers').setUserInfo;
const getRole = require('../helpers').getRole;
const config = require('../config/main');

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // in seconds
  });
}

//= =======================================
// Login Route
//= =======================================
exports.login = function (req, res, next) {
    console.log('connecting...');
    let  {Username, Password } = req.body;
    if( Username !== undefined && Password !== undefined ) {
        UserModel.findOne({
            where: { Username: Username, Password: Password },
            attributes: ['UserID', 'Username', 'Password', 'UserSecurityClearance_ClearanceID']
        }).then( user => {
                console.log('User: ', user.dataValues);
                res.status(200).send(user.dataValues);
            }).catch( error =>{
                console.log('error: ', 'User not found.');
                res.status(404).send('User not found');
            })
    }else{
        console.log('Undefined Username or Password')
        res.status(401).send('No parameters');
    }
};

exports.getUserByName = function (req, res, next) {
    console.log('connecting...');
    let { username } = req.query;
    if( username !== undefined ) {
        UserModel.findOne({
            where: { Username: username },
            attributes: ['UserID', 'Username', 'Password', 'UserSecurityClearance_ClearanceID']
        }).then( user => {
            res.status(200).send(user);
        }).catch( error =>{
            console.log('error: ', 'User not found.');
            res.status(404).send({
                'UserID': -1,
                'Username': '',
                'Password':'',
                'UserSecurityClearance_ClearanceID': ""
            });
        })
    } else {
        console.log('error: ', 'Invalid Params.');
        res.status(404).send('Invalid Params');
    }
};
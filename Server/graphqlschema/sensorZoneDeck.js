const DeckZonesModel = require('../models').DeckZones;
const DeckLocationsModel = require('../models').DeckLocations;
const DeviceModel = require('../models').SecurityDevices;
const EquipmentTypesModel = require('../models').EquipmentTypes;
const graphql = require('graphql'),
    { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = graphql


var deckzones = async (DeckNumber) => {
    return await new Promise((resolve) => {
        DeckZonesModel.findAll({
            where: { DeckNumber },
            attributes:
                [
                    'DeckZoneID',
                    'DeckZoneName',
                    'DeckNumber'
                ]
        }).then(deckZones => {
            resolve(deckZones);
        }).catch(error => {
            console.log('error: ', 'DeckZones not found.');
            resolve([]);
        })
    })
}

var deckLocations = async (DeckZoneID) => {

    return await new Promise((resolve) => {
        DeckLocationsModel.findAll(
            {
                where: { DeckZoneID },
                attributes:
                    [
                        'LocationID',
                        'DeckNumber'
                    ]
            }).then(DeckLocations => {
                resolve(DeckLocations);
            }).catch(error => {
                console.log('error: ', 'DeckLocations not found.');
                resolve([]);
            })
    })
}

var securitydevices = async (LocationID) => {

    return await new Promise((resolve) => {
        DeviceModel.findAll(
            {
                where: { LocationID },
                attributes:
                    [
                        'DeviceID',
                        'EquipmentTypeID'
                    ]
            }).then(SecurityDevices => {
                resolve(SecurityDevices);
            }).catch(error => {
                console.log('error: ', 'SecurityDevices not found.');
                resolve([]);
            })
    })
}

var equipmenttypes = async (EquipmentTypeID) => {

    return await new Promise((resolve) => {
        EquipmentTypesModel.findAll(
            {
                where: { EquipmentTypeID },
                attributes:
                    [
                        'EquipmentTypeID',
                        'EquipmentTypeName'
                    ]
            }).then(equipmenttypes => {
                resolve(equipmenttypes);
            }).catch(error => {
                console.log('error: ', 'equipmenttypes not found.', error);
                resolve([]);
            })
    })
}

const EquipmentType = new GraphQLObjectType({
    name: "Equipmen",
    fields: {
        EquipmentTypeName: {
            type: GraphQLID
        }
    }
})

const SecurityDeviceType = new GraphQLObjectType({
    name: "SecurityDevice",
    fields: {
        DeviceID: {
            type: GraphQLID
        },
        EquipmentTypeID: {
            type: GraphQLID
        },
        Equipments: {
            type: new GraphQLList(EquipmentType),
            args: { EquipmentTypeName: { type: GraphQLString } },
            resolve(parent, args) {
                return equipmenttypes(parent.EquipmentTypeID)

            }
        }
    }
})

const DeckLocationType = new GraphQLObjectType({
    name: "DeckLocation",
    fields: {
        LocationID: {
            type: GraphQLID
        },
        SecurityDevices: {
            type: new GraphQLList(SecurityDeviceType),
            resolve(parent, args) {
                return securitydevices(parent.LocationID)
            }
        }
    }
})

const DeckZoneType = new GraphQLObjectType({
    name: 'DeckZone',
    fields: {
        DeckZoneID: {
            type: GraphQLID
        },
        DeckZoneName: {
            type: GraphQLString
        },
        DeckNumber: {
            type: GraphQLID
        },
        DeckLocations: {
            type: new GraphQLList(DeckLocationType),
            resolve(parent, args) {
                return deckLocations(parent.DeckZoneID)
            }
        }
    }
})
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        DeckZones: {
            type: new GraphQLList(DeckZoneType),
            args: { deckNum: { type: GraphQLID } },
            resolve(parent, args) {
                return deckzones(args.deckNum)
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery
})

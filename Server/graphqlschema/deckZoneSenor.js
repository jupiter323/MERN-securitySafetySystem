const DeckZonesModel = require('../models').DeckZones;
const DeckLocationsModel = require('../models').DeckLocations;
const DeviceModel = require('../models').SecurityDevices;
const EquipmentTypesModel = require('../models').EquipmentTypes;
const SecurityEventsModel = require('../models').SecurityEvents;
const EventAttributesModel = require('../models').EventAttributes;
const UserModel = require('../models').UserPasswords;
const graphql = require('graphql'),
    { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLInt } = graphql


var deckzones = async (DeckNumber) => {
    console.log(DeckNumber)
    DeckNumber = DeckNumber ? { DeckNumber } : null
    return await new Promise((resolve) => {
        DeckZonesModel.findAll({
            where: DeckNumber,
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
var getDeviceIdByName = async (DeviceName) => {
    return await new Promise((resolve) => {
        DeviceModel.findAll(
            {
                where: { DeviceName },
                attributes:
                    [
                        'DeviceID'
                    ]
            }).then(deviceID => {
                resolve(deviceID[0].DeviceID);
            }).catch(error => {
                console.log('error: ', 'getDeviceIdByName not found.', error);
                resolve([]);
            })
    })
}
var getEventListByDeviceID = async (DeviceID) => {
    return await new Promise((resolve) => {
        SecurityEventsModel.findAll(
            {
                // order: [['DateTime', 'DESC']],
                // limit:300,
                where: { DeviceID: DeviceID },
                attributes:
                    [
                        "EventID",
                        'EventMsg',
                        'DateTime'

                    ]
            }).then(eventlist => {
                resolve(eventlist);
            }).catch(error => {
                console.log('error: ', 'getEventListByDeviceID not found.', error);
                resolve([]);
            })
    })
}
var getEventAttributesByEventID = async (EventID) => {
    return await new Promise((resolve) => {
        EventAttributesModel.findOne(
            {
                where: { EventID },
                attributes:
                    [
                        "AttributeValueString"              
                    ]
            }).then(EventAttribute => {
                resolve(EventAttribute);
            }).catch(error => {
                console.log('error: ', 'getEventAttributesByEventID not found.', error);
                resolve([]);
            })
    })
}
var userInfomationByUsername = async (Username) => {
    return await new Promise((resolve) => {
        UserModel.findOne(
            {
                where: { Username },
                attributes:
                    [
                        "UserID",
                        "UserSecurityClearance_ClearanceID"              
                    ]
            }).then(user => {
                resolve(user);
            }).catch(error => {
                console.log('error: ', 'userInfomationByUsername not found.', error);
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
            type: GraphQLInt
        },
        DeckLocations: {
            type: new GraphQLList(DeckLocationType),
            resolve(parent, args) {
                return deckLocations(parent.DeckZoneID)
            }
        }
    }
})


const UserPassword = new GraphQLObjectType({
    name: 'UserPassword',
    fields: {
        UserID: {
            type: GraphQLInt
        },
        UserSecurityClearance_ClearanceID: {
            type: GraphQLInt
        }
    }
})

const EventAttribute = new GraphQLObjectType({
    name: 'EventAttribute',
    fields: {
        AttributeValueString: {
            type: GraphQLString
        },
        UserPassword: {
            type: UserPassword,
            resolve(parent, args) {
                return userInfomationByUsername(parent.AttributeValueString)
            }
        }
    }
})

const LogEvent = new GraphQLObjectType({
    name: 'LogEvent',
    fields: {
        DateTime: {
            type: GraphQLString
        },
        EventAttribute: {
            type: EventAttribute,
            resolve(parent, args) {
                return getEventAttributesByEventID(parent.EventID)
            }

        },
        EventID: {
            type: GraphQLInt
        },
        EventMsg: {
            type: GraphQLString
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
                return deckzones(args.deckNum && args.deckNum)
            }
        },
        DeviceEventCount: {
            type: GraphQLInt,
            args: { DeviceName: { type: GraphQLID } },
            async resolve(parent, args) {
                let DeviceID = await getDeviceIdByName(args.DeviceName);
                let EventList = await getEventListByDeviceID(DeviceID);
                let EventCounts = EventList.length;
                return EventCounts
            }
        },
        LogEvents: {
            type: new GraphQLList(LogEvent),
            args: { DeviceID: { type: GraphQLInt } },
            resolve(parent, args) {
                return getEventListByDeviceID(args.DeviceID)
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery
})

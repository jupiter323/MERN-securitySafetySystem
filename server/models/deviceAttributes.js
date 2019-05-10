module.exports = function(sequelize, Sequalize) {
    let DeviceAttributesSchema = sequelize.define("DeviceAttributes", {
        AttributeID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        AttributeNameID: Sequalize.INTEGER,
        AttributeValue: Sequalize.STRING,
        SecurityDeviceID: Sequalize.INTEGER,
        AuxiliaryDeviceID: Sequalize.INTEGER
    });
    return DeviceAttributesSchema;
}
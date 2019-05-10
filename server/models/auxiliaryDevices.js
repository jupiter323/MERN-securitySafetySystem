module.exports = function(sequelize, Sequalize) {
    let AuxiliaryDevicesSchema = sequelize.define("AuxiliaryDevices", {
        AuxDeviceID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        AuxDeviceName: Sequalize.STRING,
        AuxEquipmentTypeID: Sequalize.INTEGER,
        AuxEquipmentSubTypeID: Sequalize.INTEGER,
        ClearanceLevelID: Sequalize.INTEGER,
        AuxDeviceSensorID: Sequalize.INTEGER
    });
    return AuxiliaryDevicesSchema;
};
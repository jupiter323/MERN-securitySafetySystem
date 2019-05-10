module.exports = function(sequelize, Sequalize) {
    let DevicesSchema = sequelize.define("SecurityDevices", {
        DeviceID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DeviceName: Sequalize.STRING,
        DeviceGUID: Sequalize.STRING,
        EquipmentTypeID: Sequalize.INTEGER,
        EquipmentSubTypeID: Sequalize.INTEGER,
        AuxDeviceID: Sequalize.INTEGER,
        ClearanceLevelID: Sequalize.INTEGER,
        LocationID: Sequalize.INTEGER,
    });
    return DevicesSchema;
};
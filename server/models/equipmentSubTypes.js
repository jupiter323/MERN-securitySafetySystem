module.exports = function(sequelize, Sequalize) {
    let EquipmentSubTypesSchema = sequelize.define("EquipmentSubTypes", {
        EquipmentSubTypeID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        EquipmentSubTypeName: Sequalize.STRING,
        EquipmentTypeID: Sequalize.INTEGER,
    });
    return EquipmentSubTypesSchema;
}
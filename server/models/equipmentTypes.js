module.exports = function(sequelize, Sequalize) {
    let EquipmentTypesSchema = sequelize.define("EquipmentTypes", {
        EquipmentTypeID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        EquipmentTypeName: Sequalize.STRING,
    });
    return EquipmentTypesSchema;
}
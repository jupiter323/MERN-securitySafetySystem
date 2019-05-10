module.exports = function(sequelize, Sequalize) {
    let ClearancesSchema = sequelize.define("SecurityClearances", {
        ClearanceID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ClearanceLevel: Sequalize.INTEGER,
        ClearanceColorRGBA: Sequalize.INTEGER,
    });
    return ClearancesSchema;
}
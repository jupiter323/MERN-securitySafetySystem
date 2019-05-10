module.exports = function(sequelize, Sequalize) {
    let DeckZonesSchema = sequelize.define("DeckZones", {
        DeckZoneID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DeckZoneName: Sequalize.STRING,
        DeckNumber: Sequalize.INTEGER,
    });
    return DeckZonesSchema;
};
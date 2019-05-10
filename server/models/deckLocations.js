module.exports = function(sequelize, Sequalize) {
    let DeckLocationsSchema = sequelize.define("DeckLocations", {
        LocationID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        LocationName: Sequalize.STRING,
        LocationX: Sequalize.FLOAT,
        LocationY: Sequalize.FLOAT,
        DeckZoneID: Sequalize.INTEGER,
        DeckNumber: Sequalize.INTEGER,
    });
    return DeckLocationsSchema;
}
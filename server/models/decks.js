module.exports = function(sequelize, Sequalize) {
    let DecksSchema = sequelize.define("Decks", {
        DeckNumber: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DeckName: Sequalize.STRING,
        Password: Sequalize.STRING,
    });
    return DecksSchema;
}
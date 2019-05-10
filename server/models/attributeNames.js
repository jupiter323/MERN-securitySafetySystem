module.exports = function(sequelize, Sequalize) {
    let AttributeNamesSchema = sequelize.define("AttributeNames", {
        AttributeNameID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        AttributeName: Sequalize.STRING,
    });
    return AttributeNamesSchema;
}
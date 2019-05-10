module.exports = function(sequelize, Sequalize) {
    let EventAttributesSchema = sequelize.define("EventAttributes", {
        EventAttributeID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        EventID: Sequalize.INTEGER,
        AttributeNameID: Sequalize.INTEGER,
        AttributeValueString: Sequalize.STRING,
        AttributeValueDataTypeID: Sequalize.INTEGER,
    });
    return EventAttributesSchema;
}
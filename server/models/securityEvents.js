module.exports = function(sequelize, Sequalize) {
    let SecurityEventsSchema = sequelize.define("SecurityEvents", {
        EventID: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DateTime: Sequalize.STRING,
        DeviceID: Sequalize.INTEGER,
        EventMsg: Sequalize.STRING,
        CurrentSecurityLevel: Sequalize.INTEGER,
        ShowEvent: Sequalize.INTEGER,
    });
    return SecurityEventsSchema;
}
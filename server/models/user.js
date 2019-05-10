module.exports = function(sequelize, Sequalize) {
    let UserSchema = sequelize.define("UserPasswords", {
        UserId: {
            type:Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Username: Sequalize.STRING,
        Password: Sequalize.STRING,
        UserSecurityClearance_ClearanceID: Sequalize.INTEGER,
    });
    return UserSchema;
}
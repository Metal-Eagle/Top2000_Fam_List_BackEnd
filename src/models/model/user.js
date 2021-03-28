const Sequelize = require('sequelize');
const sequelize = require('../../service/dataBaseConnection')

const Model = Sequelize.Model;
class User extends Model {}

User.init({
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        validate: {
            isUUID: 4,
        },
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'user',
    // options
});

module.exports = User
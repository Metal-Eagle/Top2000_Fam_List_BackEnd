const Sequelize = require('sequelize');
const sequelize = require('../../service/dataBaseConnection')
const encryptString = require('../../service/encryptionService');


const Model = Sequelize.Model;
class Family extends Model { }

Family.init({
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        validate: {
            isUUID: 4,
        },
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    secret: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'family',
    // options
});

Family.beforeCreate(async (family, options) => {
    try {
        // let passwordHash = await encryptString(family.secret)
        family.dataValues.secret = family.secret
    } catch (err) {
        console.log(err);
    }
});


module.exports = Family
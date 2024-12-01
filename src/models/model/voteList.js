const Sequelize = require('sequelize');
const sequelize = require('../../service/dataBaseConnection')

const getDataFormVoteList = require('../../service/getDataFromList')
const {
    createSong
} = require('./song')

const Model = Sequelize.Model;
class VoteList extends Model { }

VoteList.init({
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        validate: {
            isUUID: 4,
        },
    },
    vote_url: {
        type: Sequelize.STRING
    },
    vote_year: {
        type: Sequelize.INTEGER
    },
}, {
    sequelize,
    modelName: 'voteList',
    // options
});


//afterCreate getTheNumbers of the list
VoteList.afterCreate(async (instance) => {
    const getList = await getDataFormVoteList(instance.vote_url, instance.vote_year)
    createSong(getList, instance.userId, instance.familyId)
});


module.exports = VoteList
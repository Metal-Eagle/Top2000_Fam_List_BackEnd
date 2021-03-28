const Sequelize = require('sequelize');
const sequelize = require('../../service/dataBaseConnection')

const Model = Sequelize.Model;
class Song extends Model {}

Song.init({
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        validate: {
            isUUID: 4,
        },
    },
    artist: {
        type: Sequelize.STRING
    },
    title: {
        type: Sequelize.STRING
    },
    audio: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING
    },
    imageBig: {
        type: Sequelize.STRING
    },
    voteYear: {
        type: Sequelize.INTEGER
    }
}, {
    sequelize,
    modelName: 'song',
    // options
});

module.exports = Song

module.exports.createSong = (list, userId, familyId) => {
    //Check if list is there?
    list.shortlist.forEach(s => {
        let song = {
            artist: s._source.artist,
            audio: s._source.audio,
            image: s._source.image,
            imageBig: s._source.imageBig,
            title: s._source.title,
            voteYear: list.year,
            userId,
            familyId
        }
        Song.create(song)
    });
}
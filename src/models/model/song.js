const Sequelize = require('sequelize');
const sequelize = require('../../service/dataBaseConnection')

const Model = Sequelize.Model;
class Song extends Model { }

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
    list.songs.forEach(s => {
        let song = {
            artist: s.artist,
            audio: s.audio,
            image: s.image,
            imageBig: s.imageBig,
            title: s.title,
            voteYear: list.year,
            userId,
            familyId
        }
        Song.create(song)
    });
}
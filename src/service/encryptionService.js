const bcrypt = require('bcrypt');

module.exports = encryptString = (string) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) reject(err)
            bcrypt.hash(string, salt, (err, hash) => {
                if (err) reject(err)
                resolve(hash)
            });
        });

    });
};
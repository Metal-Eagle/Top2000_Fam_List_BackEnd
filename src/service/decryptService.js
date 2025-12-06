const bcrypt = require('bcrypt');

module.exports = isStringAndHashSame = (string, stringHash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string, stringHash, (err, result) => {
            if (err) reject(err)
            if (result) resolve(result)
            else reject(result)
        });
    });

}
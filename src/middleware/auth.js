const isStringAndHashSame = require('../service/decryptService');

const responseService = require('../service/responseService')
const {
    getFamilyById
} = require('../models/mainModel')


module.exports = async (req, res, next) => {
    try {
        const {
            familyId,
            secret: secretString
        } = req.body
        // get secret of familyId
        const {
            secret: secretHash
        } = await getFamilyById(familyId)
        //check secret if good One
        const checkSecret = await isStringAndHashSame(secretString, secretHash)
        if (checkSecret) {
            next()
        }
    } catch (err) {
        responseService({
            res: res,
            data: err,
            statusCode: 401
        })
    }

};
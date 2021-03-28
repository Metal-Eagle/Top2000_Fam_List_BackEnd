const express = require("express");
const router = express.Router();
const responseService = require('../../service/responseService')

const {
    createUsers,
} = require('../../models/mainModel')

router.post("/", (req, res) => {
    createUsers(req.body)
        .then(resp => {
            responseService({
                res: res,
                data: resp,
                statusCode: 200
            })
        }).catch(err => {
            responseService({
                res: res,
                data: err,
                statusCode: 400
            })
        })
});


module.exports = router;
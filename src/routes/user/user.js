const express = require("express");
const router = express.Router();
const responseService = require('../../service/responseService')

const {
    getUserById,
    createUser,
} = require('../../models/mainModel')

router.get("/", (req, res) => {
    getUserById(req.body)
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

router.post("/", (req, res) => {
    createUser(req.body)
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
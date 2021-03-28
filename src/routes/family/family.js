const express = require("express");
const router = express.Router();
const responseService = require('../../service/responseService')

const {
    getFamilyById,
    getFamilyByName,
    createFamily,
    createUsers
} = require('../../models/mainModel')

router.get("/", (req, res) => {
    if (req.query.id) {
        getFamilyById(req.query.id)
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
    } else if (req.query.name) {
        getFamilyByName(req.query.name)
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
    }


});

router.post("/", (req, res) => {
    createFamily(req.body)
        .then(createFamilyResp => {
            if (req.body.users) {
                let body = {
                    familyId: createFamilyResp.id,
                    users: req.body.users
                }
                createUsers(body).then(resp => {
                    responseService({
                        res: res,
                        data: createFamilyResp,
                        statusCode: 200
                    })
                }).catch(err => {
                    responseService({
                        res: res,
                        data: err,
                        statusCode: 400
                    })
                })
            } else {
                responseService({
                    res: res,
                    data: resp,
                    statusCode: 200
                })
            }
        }).catch(err => {

            if (err.errors[0].message === 'name must be unique') {
                responseService({
                    res: res,
                    data: err.errors,
                    statusCode: 409
                })
            } else {
                responseService({
                    res: res,
                    data: err.errors,
                    statusCode: 400
                })
            }


        })
});


module.exports = router;
const express = require("express");
const router = express.Router();
const responseService = require('../../service/responseService')

const {
    buildPlaylist
} = require("../../service/spotifyService")

router.post("/", (req, res) => {
    buildPlaylist(req.body).then(r => {
        responseService({
            res: res,
            data: r,
            statusCode: 200
        })
    }).catch(e => {
        responseService({
            res: res,
            data: e,
            statusCode: 404
        })
    })

});


module.exports = router;
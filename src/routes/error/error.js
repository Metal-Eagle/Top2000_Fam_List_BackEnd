const express = require("express");
const router = express.Router();
const responseService = require('../../service/responseService')

router.use((req, res, next) => {
    if (!req.route) {
        responseService({
            res: res,
            data: {
                error: "Route not found"
            },
            statusCode: 404
        });
    }
    next();
});

module.exports = router;
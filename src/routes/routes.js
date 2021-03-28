module.exports = (app) => {

    const family = require("./family/family");
    app.use("/api/v1/family", family);

    const spotify = require("./spotify/spotify");
    app.use("/api/v1/spotifyList", spotify);

    // check all posts if secret is there
    const auth = require('../middleware/auth')
    app.post('*', auth)
    app.put('*', auth)
    app.delete('*', auth)

    const user = require("./user/user");
    app.use("/api/v1/user", user);

    const users = require("./users/users");
    app.use("/api/v1/users", users);



    // default error msg
    const error = require("./error/error");
    app.use("*", error);

}
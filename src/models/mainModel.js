const sequelize = require("../service/dataBaseConnection");

const Family = require("./model/family");
const User = require("./model/user");
const VoteList = require("./model/voteList");
const Song = require("./model/song");

Family.hasMany(User, {
  as: "users",
});

Family.hasMany(Song, {
  as: "songs",
});

Family.hasMany(VoteList, {
  as: "voteList",
});

User.hasMany(VoteList, {
  as: "voteList",
});
User.hasMany(Song, {
  as: "song",
});

sequelize.sync();

module.exports.getFamilyById = (id) => {
  return new Promise((resolve, reject) => {
    Family.findOne({
      where: {
        id: id,
      },
      include: ["users", "songs"],
      attributes: {
        exclude: ["secret"],
      },
    })
      .then((r) => {
        resolve(r);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports.getSongsByFamilyIdWithFilteredUsersAndFilterdYears = (
  options
) => {
  return new Promise((resolve, reject) => {
    const { id, userId, year } = options;

    let whereQuery = {
      familyId: id,
    };
    if (userId !== null) whereQuery.userId = userId;
    if (year !== null) whereQuery.voteYear = year;
    Song.findAll({
      where: whereQuery,
    })
      .then((f) => {
        resolve(f);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports.getFamilyByIdWithSecret = (id) => {
  return new Promise((resolve, reject) => {
    Family.findOne({
      where: {
        id: id,
      },
    })
      .then((r) => {
        resolve(r);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports.getFamilyByName = (name) => {
  return new Promise((resolve, reject) => {
    Family.findOne({
      where: {
        name,
      },
      include: ["users", "songs"],
      attributes: {
        exclude: ["secret"],
      },
    })
      .then((r) => {
        resolve(r);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports.createFamily = (body) => {
  const { name, secret } = body;
  return new Promise((resolve, reject) => {
    Family.create({
      name,
      secret,
    })
      .then((r) => {
        resolve(r);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports.getUserById = (body) => {
  const { id } = body;
  return new Promise((resolve, reject) => {
    User.findOne({
      where: {
        id: id,
      },
      include: ["voteList", "song"],
    })
      .then((r) => {
        resolve(r);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports.createUser = (body) => {
  const { fullName, familyId, years } = body;
  return new Promise((resolve, reject) => {
    findOrCreateUser(fullName, familyId)
      .then((r) => {
        years.forEach(async (e) => {
          VoteList.create({
            userId: r.id,
            vote_year: e.vote_year,
            vote_url: e.vote_url,
            familyId: r.familyId,
          })
            .then(() => {
              User.findOne({
                where: {
                  id: r.id,
                },
                include: ["voteList"],
              })
                .then((r) => {
                  resolve(r);
                })
                .catch((e) => {
                  reject(e);
                });
            })
            .catch((e) => {
              reject(e);
            });
        });
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports.updateUser = (body) => {
  const { years, userId } = body;
  return new Promise((resolve, reject) => {
    User.findByPk(userId)
      .then((r) => {
        years.forEach(async (e) => {
          VoteList.findCreateFind({
            where: { vote_year: e.vote_year, userId: r.id },
            defaults: {
              userId: r.id,
              vote_year: e.vote_year,
              vote_url: e.vote_url,
              familyId: r.familyId,
            },
          })
            .then(() => {
              User.findOne({
                where: {
                  id: r.id,
                },
                include: ["voteList"],
              })
                .then((r) => {
                  resolve(r);
                })
                .catch((e) => {
                  reject(e);
                });
            })
            .catch((e) => {
              reject(e);
            });
        });
      })
      .catch((e) => {
        reject(e);
      });
  });
};

module.exports.createUsers = (body) => {
  return new Promise(async (resolve, reject) => {
    const { familyId } = body;

    let users = [];
    body.users.forEach((e) => {
      e.familyId = familyId;
      users.push(e);
    });
    User.bulkCreate(users).then((newUser) => {
      resolve(newUser);
      newUser.forEach((u) => {
        let user = body.users.find((e) => e.fullName === u.fullName);
        user.years.forEach((e) => {
          VoteList.create({
            userId: u.id,
            vote_year: e.vote_year,
            vote_url: e.vote_url,
            familyId,
          })
            .then(() => {
              resolve(
                User.findAll({
                  where: {
                    familyId,
                  },
                  attributes: {
                    exclude: ["secret"],
                  },
                })
              );
            })
            .catch((e) => {
              reject(e);
            });
        });
      });
    });
  });
};



async function findOrCreateUser(fullName, familyId) {
  let user = await User.findOne({
    where: {
      fullName,
      familyId,
    },
  });
  if (!user) {
    user = await User.create({
      fullName,
      familyId,
    })
  }
  return user
}
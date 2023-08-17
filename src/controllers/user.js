const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  let users = [];
  let queryObject = {};

  let isProcuror = req.query.isProcuror;
  let isGrefier = req.query.isGrefier;

  if (isProcuror === "1") {
    queryObject.isProcuror = "1";
  }

  if (isGrefier === "1") {
    queryObject.isGrefier = "1";
  }

  try {
    users = await User.findAll({ where: queryObject });
    res.status(200).json({
      users: users,
    });
  } catch (err) {
    next(err);
  }
};

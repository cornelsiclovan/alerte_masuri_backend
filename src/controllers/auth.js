const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const crypto = require("crypto");
const config = require("config");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!req.body.repeatPassword) {
      const error = new Error("Repeated password cannot be empty!");
      error.statusCode = 422;
      throw error;
    }

    if (req.body.repeatPassword !== req.body.password) {
      const error = new Error("Passwords do not match!");
      error.statusCode = 422;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error("Registration failed!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
  } catch (error) {
    next(error);
    return;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.create({
      name: name,
      email: email,
      password: password,
    });

    res.status(200).json({
      message: "User created!",
      userId: user.id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Login failed!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
  } catch (error) {
    next(error);
    return;
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      const error = new Error("This email could not be found!");
      error.statusCode = 401;
      throw error;
    }

    if (password !== user.password) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      process.env.JWT_KEY,
      { expiresIn: "10h" }
    );

    res.status(200).json({
      token: token,
      userId: user.id,
      initial_login: user.initial_login,
      isAdmin: user.isAdmin,
      isProcuror: user.isProcuror,
      isGrefier: user.isGrefier,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


exports.changePassword = async (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const newPasswordRepeat = req.body.newPasswordRepeat;

  try {

    if(!email || !oldPassword || !newPassword || !newPasswordRepeat) {
      const error = new Error("all data must be complete");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findOne({ where: { email: email, password: oldPassword } });

    if(!user) {
      const error = new Error("this user does not exist, or password is incorrect");
      error.statusCode = 401;
      throw error;
    }

    user.initial_login = 0;
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      message: "success!"
    })
  } catch(error) {
    next(error);
  }
}
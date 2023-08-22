const Infractiuni = require("../models/infractiuni");
const {Op} = require("sequelize");

exports.getInfractiuni = async (req, res, next) => {
  let infractiuni = [];
  let queryObject = {};

  let numeInfractiune = req.query.nume;
  
  if (numeInfractiune) {
    queryObject = {nume: {[Op.like] : '%' + numeInfractiune + '%'}}
  }

  console.log(queryObject);

  try {
    infractiuni = await Infractiuni.findAll({ where: queryObject});
    res.status(200).json({
      infractiuni: infractiuni,
    });
  } catch (err) {
    next(err);
  }
};

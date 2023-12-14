const Infractiuni = require("../models/infractiuni");
const {Op} = require("sequelize");
const Pedepse = require("../models/pedepse");

exports.getPedepse = async (req, res, next) => {
  let pedepse = [];

 const id_infractiune = req.query.id_infractiune;

  try {
    pedepse = await Pedepse.findAll({ where: {id_infractiune: id_infractiune}});
    res.status(200).json({
      pedepse: pedepse,
    });
  } catch (err) {
    next(err);
  }
};

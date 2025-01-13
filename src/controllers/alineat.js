const Sequelize = require("sequelize");
const Alineat = require("../models/alineat");
const Infractiuni = require("../models/infractiuni");

const op = Sequelize.Op;

exports.getAlineateByInfractiuneId = async (req, res, next) => {
  let alineate;
  const id_infractiune = req.params.id_infractiune;
  
  try {
    const infractiune = await Infractiuni.findAll({ where: { articol: id_infractiune } });
   
    alineate = await Alineat.findAll({ where: { id_infractiune: infractiune[0].id } });
    if (!alineate) {
      const error = new Error("Acest dosar nu exista.");
      error.statusCode = 404;
      throw error;
    }

    let alineateToSend = [];

    alineate.map(alineat =>{
      alineat.dataValues.articol_infractiune = id_infractiune;
      console.log(alineat);
      alineateToSend.push(alineat);
    })



    res.status(200).json({ alineate: alineateToSend });
  } catch (err) {
    next(err);
  }
};

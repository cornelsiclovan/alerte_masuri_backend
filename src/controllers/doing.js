const Sequelize = require("sequelize");
const Doing = require("../models/fapte");
const DoingAc = require("../models/fapteAc");

const op = Sequelize.Op;

exports.getDoingByDosarNumber = async (req, res, next) => {
  let doing;
  const dosar_numar = req.params.dosar_numar;

  try {
    doing = await Doing.findAll({ where: { numar: dosar_numar } });
    if (!dosar) {
      const error = new Error("Acest dosar nu exista.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ doing: doing });
  } catch (err) {
    next(err);
  }
};

exports.postDoing = async (req, res, next) => {


  try {
    if(!req || !req.body) {
      console.log(error);
      throw new Error("No body");
    }

    const doing = await Doing.create({
      numar_dosar: req.body.numar_dosar || "test",
      nume_infractiune: req.body.nume_infractiune || "test",
      data_savarsirii: req.body.data_savarsirii || "01.01.2000",
      nume_temei: req.body.nume_temei || " - ",
      situatie: req.body.situatie || " - ",
    });
 
    res.status(200).json({
      doing: doing,
    });
  } catch (err) {
    
    console.log(err);
    console.log(req.body); 
    if (!err.statusCode) {
      err.statusCode = 404;

    }
    next(err);
  }
};

exports.cleanDoings = async (req, res, next) => {
  await Doing.destroy({ where: {} });

  res.status(200).json({
    message: "clean doings",
  });
}

exports.postDoingAc = async (req, res, next) => {


  try {
    if(!req || !req.body) {
      console.log(error);
      throw new Error("No body");
    }

    const doing = await DoingAc.create({
      numar_dosar: req.body.numar_dosar || "test",
      nume_infractiune: req.body.nume_infractiune || "test",
      data_savarsirii: req.body.data_savarsirii || "01.01.2000",
      nume_temei: req.body.nume_temei || " - ",
      situatie: req.body.situatie || " - ",
    });
 
    res.status(200).json({
      doing: doing,
    });
  } catch (err) {
    
    console.log(err);
    console.log(req.body); 
    if (!err.statusCode) {
      err.statusCode = 404;

    }
    next(err);
  }
};

exports.cleanDoingsAc = async (req, res, next) => {
  await DoingAc.destroy({ where: {} });

  res.status(200).json({
    message: "clean doings ac",
  });
}
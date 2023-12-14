const Sequelize = require("sequelize");
const Part = require("../models/part");
const Doing = require("../models/fapte");

const op = Sequelize.Op;

exports.getPArtByDosarNumber = async (req, res, next) => {
  let part;
  const dosar_numar = req.params.dosar_numar;

  try {
    part = await Part.findAll({ where: { numar: dosar_numar } });
    if (!dosar) {
      const error = new Error("Acest dosar nu exista.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ part: part });
  } catch (err) {
    next(err);
  }
};

exports.postPart = async (req, res, next) => {
  try {
    const part = await Part.create({
      tip_solutie_propusa: req.body.tip_solutie_propusa,
      numar_dosar: req.body.numar,
      nume: req.body.nume,
      ordine: req.body.ordine,
    });

    res.status(200).json({
      part: part,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
};

exports.cleanParts = async (req, res, next) => {
  await Part.destroy({ where: {} });

  res.status(200).json({
    message: "clean parts",
  });
};

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
      adresa: req.body.adresa,
      tara: req.body.tara,
      judet: req.body.judet,
      localitate: req.body.localitate,
      sector: req.body.sector,
      numar: req.body.numar_adresa,
      bloc: req.body.bloc,
      scara: req.body.scara,
      etaj: req.body.etaj,
      apartament: req.body.apartament,
      cnp: req.body.cnp,
      numar2: req.body.numar2,
      serie_buletin: req.body.serie,
      numar_buletin: req.body.numar_ci,
      tata: req.body.tata,
      mama: req.body.mama,
      data_nasterii: req.body.data_nasterii,
      locul_nasterii: req.body.locul_nasterii,
      stare_civila: req.body.stare_civila,
      studii: req.body.studii,
      ocupatie: req.body.ocupatie,
      judet_nastere: req.body.judet_nastere,
      minor: req.body.minor
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

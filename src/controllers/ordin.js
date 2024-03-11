const { Op } = require("sequelize");
const Ordin = require("../models/ordin");
const fs = require("fs");

exports.getOrdine = async (req, res, next) => {
  let ordine = [];

  try {
    ordine = await Ordin.findAll();
    res.status(200).json({
      ordine: ordine,
    });
  } catch (err) {
    next(err);
  }
};

exports.postOrdin = async (req, res, next) => {
  let numar = req.body.numar;
  let descriere = req.body.descriere;
  let docsArray = [];

  try {
    if (req.files["docs"]) {
      req.files["docs"].map((file) => {
        docsArray.push(file.path);
      });
    }

    let ordin = await Ordin.create({
      numar: numar,
      descriere: descriere,
      nume_fisier: docsArray[0],
    });

    res.status(200).json({
      ordin: ordin,
    });
  } catch (err) {
    next(err);
  }
};

exports.editOrdin = async (req, res, next) => {
  let ordinId = req.params.ordinId;
  let docsArray = [];

  console.log(req.body.numar);
  console.log(req.body.descriere);

  try {
    const ordin = await Ordin.findAll({ where: { id: ordinId } });
    
    fs.unlink(ordin[0].nume_fisier, data => {
      console.log("success delete")
    });
    if (req.files["docs"]) {
      req.files["docs"].map((file) => {
        docsArray.push(file.path);
      });
    }
    
    

    ordin[0].numar = req.body.numar;
    ordin[0].descriere = req.body.descriere;
    ordin[0].nume_fisier = docsArray[0];

    await ordin[0].save();

    res.status(200).json({
      ordin: ordin,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOrdin = async (req, res, next) => {
  let ordinId = req.params.ordinId;

  try {
    const ordin = await Ordin.findAll({ where: { id: ordinId } });

    console.log(ordin[0].nume_fisier);


    fs.unlink(ordin[0].nume_fisier, data => {
        console.log(data);
    });

    await Ordin.destroy({where: {id: ordinId}});
  

    res.status(200).json({
        message: "ordin deleted",
      });
  } catch (error) {
    next(error);
  }
};

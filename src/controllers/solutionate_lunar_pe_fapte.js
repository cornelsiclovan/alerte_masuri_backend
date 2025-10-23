const SolutionateLunarPeFapte = require("../models/solutionate_lunar_pe_fapte");
const User = require("../models/user");

exports.getDateDosare = async (req, res, next) => {
  let dateDosare = [];
  let totalItems = 0;

  queryObject = {};


  let procurorId = req.query.procurorId;
  let isAdmin = req.query.isAdmin;

  if (!procurorId && isAdmin !== "1") {
    queryObject.userId = req.userId;
  }

  if (procurorId === "1") {
    let proc = await User.findByPk(req.userId);
    queryObject.procurorId = proc.name;
  }


  try {
    dateDosare = await SolutionateLunarPeFapte.findAll({ where: queryObject });
    totalItems = dateDosare.length;
    let fapte = [];


    let dateDosareToSend = await Promise.all(
      dateDosare.map(async (itemData) => {
        const procuror = await User.findByPk(itemData.procurorId);
        let numeProcuror = "null";
        if (procuror) {
          numeProcuror = procuror.name;
        }
        if (!fapte.includes(itemData.fapta)) {
          fapte.push(itemData.fapta);
        }
        return {
          id: itemData.id,
          numar_solutii: itemData.numar_solutii,
          nume_solutie: itemData.nume_solutie,
          nume_pe_scurt_solutie: itemData.nume_pe_scurt_solutie,
          procurorId: itemData.procurorId,
          numeProcuror: itemData.procurorId,
          fapta: itemData.fapta,
          an_solutie: itemData.an_solutie,
          luna_solutie: itemData.luna_solutie
        };
      })
    );

    let sortedData = dateDosareToSend.sort(
      (a, b) => new Date(a.an_solutie) - new Date(b.an_solutie)
    );

    res.status(200).json({ dosare: sortedData, totalItems: totalItems, fapte: fapte });
  } catch (error) {
    next(error);
  }
};

exports.addDateDosare = async (req, res, next) => {
  let numePeScurtSolutie = "nedefinit";

  if (req.body.calea_completa.includes("Clasare")) {
    numePeScurtSolutie = "Clasare";
  }

  if (req.body.calea_completa.includes("Rechizitoriu")) {
    numePeScurtSolutie = "Rechizitoriu";
  }

  if (req.body.calea_completa.includes("Declinare")) {
    numePeScurtSolutie = "Declinare";
  }

  if (req.body.calea_completa.includes("Renun")) {
    numePeScurtSolutie = "Renuntare"
  }

  if (req.body.calea_completa.includes("Acord de recunoa")) {
    numePeScurtSolutie = "Acord de recunoastere"
  }

  let nume_solutie = "";

  if (req.body.calea_completa.length >= 255) {
    nume_solutie = req.body.calea_completa.substring(0, 250);
  } else {
    nume_solutie = req.body.calea_completa;
  }


  try {
    let dosar;

    dosar = await SolutionateLunarPeFapte.findAll({ where: { an_solutie: req.body.an_solutie, luna_solutie: req.body.luna_solutie, procurorId: req.body.procuror, nume_pe_scurt_solutie: numePeScurtSolutie } })


    if (dosar.length === 0) {



      dosar = await SolutionateLunarPeFapte.create({

        an_solutie: req.body.an_solutie,
        luna_solutie: req.body.luna_solutie,
        procurorId: req.body.procuror,
        fapta: req.body.fapta,
        numar_solutii: req.body.numar_solutii,
        nume_solutie: nume_solutie,
        nume_pe_scurt_solutie: numePeScurtSolutie
      });
    } else {

      if (!fapte.includes(req.body.fapta)) {
        fapte.push(req.body.fapta);
      }
      dosar[0].numar_solutii = parseInt(dosar[0].numar_solutii) + parseInt(req.body.numar_solutii);
      console.log(req.body.numar_solutii, dosar[0].numar_solutii);
      dosar[0].save();
    }


    res.status(200).json({
      dosar: dosar,
      fapte: fapte
    });
  } catch (err) {
    console.log(err);

    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
};

exports.cleanDateDosare = async (req, res, next) => {
  await SolutionateLunarPeFapte.destroy({
    where: {}
  });

  res.status(200).json({
    message: "clean date dosare solutionate",
  });
};

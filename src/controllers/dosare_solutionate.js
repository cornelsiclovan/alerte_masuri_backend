const DosareSolutionate = require("../models/dosare_solutionate");
const User = require("../models/user");

exports.getDateDosare = async (req, res, next) => {
  let dateDosare = [];
  let totalItems = 0;

  queryObject = {};

  try {
    dateDosare = await DosareSolutionate.findAll({ where: queryObject });
    totalItems = dateDosare.length;

    let dateDosareToSend = await Promise.all(
      dateDosare.map(async (itemData) => {
        const procuror = await User.findByPk(dosar.procurorId);
        let numeProcuror = "null";
        if (procuror) {
          numeProcuror = procuror.name;
        }
        return {
          id: itemData.id,
          numar_solutii: itemData.numar_solutii,
          nume_solutie: itemData.nume_solutie,
          procurorId: itemData.procurorId,
          numeProcuror: numeProcuror,
          an_solutie: itemData.an_solutie,
        };
      })
    );

    let sortedData = dateDosareToSend.sort(
      (a, b) => new Date(a.an_solutie) - new Date(b.an_solutie)
    );

    res.status(200).json({ dosare: sortedData, totalItems: totalItems });
  } catch (error) {
    next(error);
  }
};

exports.addDateDosare = async (req, res, next) => {
  let numePeScurtSolutie;

  if (req.body.calea_completa.includes("Clasare")) {
    numePeScurtSolutie = "Clasare";
  }

  if (req.body.calea_completa.includes("Rechizitoriu")) {
    numePeScurtSolutie = "Rechizitoriu";
  }

  if (req.body.calea_completa.includes("Declinare")) {
    numePeScurtSolutie = "Declinare";
  }

  if(req.body.calea_completa.includes("Renun")) {
    numePeScurtSolutie = "Renuntare"
  }

  let nume_solutie = "";

  if(req.body.calea_completa.length >= 255) {
    nume_solutie = req.body.calea_completa.substring(0, 250);
  } else {
    nume_solutie = req.body.calea_completa;
  }


  try {
    const dosar = await DosareSolutionate.create({
    
      an_solutie: req.body.an_solutie,
      procurorId: req.body.stabilita_id_procuror,
      numar_solutii: req.body.numar_solutii,
      nume_solutie: nume_solutie, 
      nume_pe_scurt_solutie: numePeScurtSolutie
    });

    const procuror = await User.findByPk(req.body.stabilita_id_procuror);

    if (!procuror) {
      await User.create({
        id: req.body.stabilita_id_procuror,
        name: req.body.procuror_nume + " " + req.body.procuror_prenume,
        email: "proc" + req.body.stabilita_id_procuror,
        isProcuror: 1,
        password: "1234",
        repeatPassword: "1234",
      });
    } else {
      console.log("procuror exists");
    }

    res.status(200).json({
      dosar: dosar,
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
  await DosareSolutionate.destroy({
    where: {}
  });

  res.status(200).json({
    message: "clean date dosare solutionate",
  });
};

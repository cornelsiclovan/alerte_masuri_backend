const Dosar = require("../models/dosar");
const DosareSolutionate = require("../models/dosare_solutionate");
const Incarcatura = require("../models/incarcatura");
const Stoc = require("../models/stoc");
const Upp = require("../models/upp");
const User = require("../models/user");
const Sequelize = require("sequelize");
const op = Sequelize.Op;

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
    queryObject.procurorId = req.userId;
  }

  try {
    dateDosare = await DosareSolutionate.findAll({ where: queryObject });
    totalItems = dateDosare.length;

    let dateDosareToSend = await Promise.all(
      dateDosare.map(async (itemData) => {
        const procuror = await User.findByPk(itemData.procurorId);
        let numeProcuror = "null";
        if (procuror) {
          numeProcuror = procuror.name;
        }
        return {
          id: itemData.id,
          numar_solutii: itemData.numar_solutii,
          nume_solutie: itemData.nume_solutie,
          nume_pe_scurt_solutie: itemData.nume_pe_scurt_solutie,
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
    numePeScurtSolutie = "Renuntare";
  }

  if (req.body.calea_completa.includes("Acord de recunoa")) {
    numePeScurtSolutie = "Acord de recunoastere";
  }

  let nume_solutie = "";

  if (req.body.calea_completa.length >= 255) {
    nume_solutie = req.body.calea_completa.substring(0, 250);
  } else {
    nume_solutie = req.body.calea_completa;
  }

  try {
    let dosar;

    dosar = await DosareSolutionate.findAll({
      where: {
        an_solutie: req.body.an_solutie,
        procurorId: req.body.stabilita_id_procuror,
        nume_pe_scurt_solutie: numePeScurtSolutie,
      },
    });

    if (dosar.length === 0) {
      dosar = await DosareSolutionate.create({
        an_solutie: req.body.an_solutie,
        procurorId: req.body.stabilita_id_procuror,
        numar_solutii: req.body.numar_solutii,
        nume_solutie: nume_solutie,
        nume_pe_scurt_solutie: numePeScurtSolutie,
      });
    } else {
      dosar[0].numar_solutii =
        parseInt(dosar[0].numar_solutii) + parseInt(req.body.numar_solutii);
      console.log(req.body.numar_solutii, dosar[0].numar_solutii);
      dosar[0].save();
    }

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
    where: {},
  });

  res.status(200).json({
    message: "clean date dosare solutionate",
  });
};

exports.getStoc = async (req, res, next) => {
  let stoc = [];
  let dosareInEvidentaActiva = 0;
  stoc = await Stoc.findAll();

  let queryObject = { institutia_curenta: { [op.ne]: null } };

  const incarcatura = await Incarcatura.findAll({});
  const totalDosCuAc = await Dosar.count({ where: queryObject });
  incarcatura.map((inc) => {
    dosareInEvidentaActiva = dosareInEvidentaActiva + +inc.number_dos_cu_an;
  });

  dosareInEvidentaActiva = dosareInEvidentaActiva + totalDosCuAc;

  if (stoc && stoc[0] && stoc[0].dataValues) {
    stoc[0].dataValues.dosareInEvidentaActiva = dosareInEvidentaActiva;
    stoc[0].dataValues.dosareInEvidentaPasiva =
      stoc[0].in_lucru - dosareInEvidentaActiva;
  }

  res.status(200).json({
    stoc: stoc,
  });
};

exports.addStoc = async (req, res, next) => {
  let dosareInEvidentaActiva = 0;

  try {
    const stoc = await Stoc.create({
      in_lucru: req.body.in_lucru,
      inregistrate_an_curent: req.body.inregistrate_an_curent,
      solutionate_an_curent: req.body.solutionate_an_curent,
    });

    res.status(200).json({
      stoc: stoc,
    });
  } catch (err) {
    next(err);
  }
};

exports.cleanStoc = async (req, res, next) => {
  await Stoc.destroy({
    where: {},
  });
  res.status(200).json({
    message: "clean stoc",
  });
};

exports.getIncarcatura = async (req, res, next) => {
  let queryObject = {};

  let procurorId = req.query.procurorId;

  if (procurorId === "1") {
    queryObject.procurorId = req.userId;
  }

  try {
    const incarcatura = await Incarcatura.findAll({
      where: queryObject,
      order: ["number_dos_cu_ac"],
    });

    let incarcaturaToSend = await Promise.all(
      incarcatura.map(async (itemData) => {
        const procuror = await User.findByPk(itemData.id_procuror);
        let numeProcuror = "null";
        if (procuror) {
          numeProcuror = procuror.name;
        }
        return {
          id: itemData.id,
          number_dos_cu_ac: itemData.number_dos_cu_ac || 0,
          number_dos_cu_an: itemData.number_dos_cu_an || 0,
          procurorId: itemData.id_procuror,
          numeProcuror: numeProcuror,
        };
      })
    );

    res.status(200).json({ incarcatura: incarcaturaToSend });
  } catch (err) {
    next(err);
  }
};

exports.addIncarcatura = async (req, res, next) => {
  let queryObject = { institutia_curenta: { [op.ne]: null } };
  queryObject.numar = req.body.numar_dosar;

  let queryObjectIntrate = { institutia_curenta: null };
  queryObjectIntrate.isArest = "0";
  queryObjectIntrate.isControlJudiciar = "0";
  queryObjectIntrate.isArest = "0";
  queryObjectIntrate.tip_solutie_propusa = "UPP";
  queryObject.isSechestru = "0";
  queryObjectIntrate.termen_contestatie = null;
  queryObjectIntrate.numar = req.body.numar_dosar;

  try {
    let incarcatura = await Incarcatura.findOne({
      where: { id_procuror: req.body.id_procuror },
    });

    if(id_procuror=127) {}

    let dosareCuAc = await Dosar.findAll({ where: queryObject });
    let dosareIntrate = await Dosar.findAll({ where: queryObjectIntrate });

    let addUpp = 0;

    if (
      req.body.invest_proprie === "True" &&
      dosareCuAc &&
      dosareCuAc.length == 0
    ) {
      //UPP
      console.log("upp 1")
      addUpp = 1;
    }

    if (req.body.invest_proprie === "True" && dosareIntrate && dosareIntrate.length == 0) {
      //UPP
      console.log("upp 1");
      addUpp = 1;
    } else {
      addUpp = 0;
    }

    if (!incarcatura) {
      incarcatura = await Incarcatura.create({
        id_procuror: req.body.id_procuror,
        number_dos_cu_ac: 0,
        number_dos_cu_an: 1,
        upp: addUpp,
      });

      
    } else if (dosareCuAc && dosareCuAc.length == 0) {
      

      incarcatura.number_dos_cu_an = +incarcatura.number_dos_cu_an + 1;
      incarcatura.upp = +incarcatura.upp + addUpp;
      await incarcatura.save();
    }

    res.status(200).json({
      incarcatura: incarcatura,
    });
  } catch (err) {
    next(err);
  }
};

exports.cleanIncarcatura = async (req, res, next) => {
  await Incarcatura.destroy({
    where: {},
  });
  res.status(200).json({
    message: "clean incarcatura pe procuror",
  });
};

exports.addUpp = async (req, res, next) => {
  console.log(req.body);

  try {
    const upp = await Upp.create({
      id_procuror: req.body.id_procuror,
      upp: req.body.nr_upp,
    });

    if(upp) {
      res.status(200).json({
        upp: upp,
      });
    } else {
      const error = new Error("cannot insert upp");
      error.statusCode = 422;
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

exports.cleanUpp = async (req, res, next) => {
  console.log("test")
  await Upp.destroy({
    where: {}
  });

  res.status(200).json({
    message: "clean upp",
  });
}
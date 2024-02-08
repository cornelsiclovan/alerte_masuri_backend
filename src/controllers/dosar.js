const { validationResult } = require("express-validator");
const Dosar = require("../models/dosar");
const User = require("../models/user");
const Sequelize = require("sequelize");
const { formatDate } = require("../util/format-date");
const Part = require("../models/part");
const Doing = require("../models/fapte");
const Pedepse = require("../models/pedepse");
const Infractiuni = require("../models/infractiuni");
const Incarcatura = require("../models/incarcatura");

const op = Sequelize.Op;

exports.getNrDosareCuAcPeProcuror = async (req, res, next) => {
  let queryObject = {};
  let procurori;
  let dosare;

  console.log("here");

  let procurorId = req.query.procurorId;

  console.log(procurorId)

  if (procurorId === "1") {
    queryObject.id = req.userId;
  }

  queryObject.isProcuror = 1;

  try {
    procurori = await User.findAll({ where: queryObject});

    let situatie_cu_ac = await Promise.all(
      procurori.map(async (procuror) => {
        let queryObject = { institutia_curenta: { [op.ne]: null } };
        queryObject.procurorId = procuror.id;
        const countDosCuAc = await Dosar.count({ where: queryObject });

        queryObject.tip_solutie_propusa = "UPP";

        const countDosCuAcUpp = await Dosar.count({where: queryObject});

        const countDosCuAn = await Incarcatura.findOne({where: {id_procuror: procuror.id}})
        
      
          return {
            procurorId: procuror.id,
            numeProcuror: procuror.name,
            number_dos_cu_an: countDosCuAn ? countDosCuAn.number_dos_cu_an : 0 ,
            number_dos_cu_ac: countDosCuAc || 0,
            number_dos_cu_ac_upp: countDosCuAcUpp || 0,
            number_dos_cu_an_upp: countDosCuAn ? countDosCuAn.upp : 0 ,
          };
      
      })  
    );

    situatie_cu_ac = situatie_cu_ac.sort((a,b) => {
    
      if(a.number_dos_cu_ac > b.number_dos_cu_ac) {
        return -1;
      }else return 1
    })

    res.status(200).json({ situatie_cu_ac: situatie_cu_ac });
  } catch (err) {
    next(err);
  }
};

exports.getDosareCuAc = async (req, res, next) => {
  let dosare = [];
  let totalItems = 0;
  let queryObject = { institutia_curenta: { [op.ne]: null } };

  let procurorId = req.query.procurorId;
  let isAdmin = req.query.isAdmin;

  if (!procurorId && isAdmin !== "1") {
    queryObject.userId = req.userId;
  }

  if (procurorId === "1") {
    queryObject.procurorId = req.userId;
  }

  try {
    dosare = await Dosar.findAll({ where: queryObject });
    totalItems = dosare.length;
    console.log("ok");
    let dosareToSend = await Promise.all(
      dosare.map(async (dosar) => {
        const procuror = await User.findByPk(dosar.procurorId);
        let numeProcuror = "null";
        if (procuror) {
          numeProcuror = procuror.name;
        }

        return {
          id: dosar.id,
          numar: dosar.numar,
          numar_fost: dosar.numar_fost,
          isControlJudiciar: dosar.isControlJudiciar,
          isArest: dosar.isArest,
          isSechestru: dosar.isSechestru,
          data: dosar.data,
          userId: dosar.userId,
          data_arest: dosar.data_arest,
          data_cj: dosar.data_cj,
          data_sechestru: dosar.data_sechestru,
          procurorId: dosar.procurorId,
          este_solutionat: dosar.este_solutionat,
          numeProcuror: numeProcuror,
          isInterceptari: dosar.isInterceptari,
          data_interceptari: dosar.data_interceptari,
          tip_solutie_propusa: dosar.tip_solutie_propusa,
          tip_solutie: dosar.tip_solutie,
          este_solutionat: dosar.este_solutionat,
          days_remaining: dosar.days_remaining,
          data_inceperii_la_procuror: dosar.data_inceperii_la_procuror,
          data_primei_sesizari: dosar.data_primei_sesizari,
          prima_institutie_sesizata: dosar.prima_institutie_sesizata,
          institutia_curenta: dosar.institutia_curenta,
        };
      })
    );

    let sortedDosare = dosareToSend.sort(
      (a, b) => new Date(a.data) - new Date(b.data)
      // new Date(a.data).getTime() < new Date(b.data).getTime ? 1 : -1
    );

    res.status(200).json({ dosare: sortedDosare, totalItems: totalItems });
  } catch (error) {
    next(error);
  }
};

exports.getDosare = async (req, res, next) => {
  let dosare = [];
  let totalItems = 0;
  let type = req.query.type;
  let dosar_name = req.query.dosar_name;

  let procurorId = req.query.procurorId;
  let isAdmin = req.query.isAdmin;
  let este_solutionat = req.query.este_solutionat;

  let queryObject = { institutia_curenta: null };

  if (dosar_name) {
    queryObject.name = dosar_name;
  }

  if (este_solutionat) {
    queryObject.este_solutionat = este_solutionat;
  }

  if (!procurorId && isAdmin !== "1") {
    queryObject.userId = req.userId;
  }

  if (procurorId === "1") {
    queryObject.procurorId = req.userId;
  }

  if (type) {
    const isSechestru = type === "1";
    const isArest = type === "2";
    const isControlJudiciar = type === "3";

    if (isSechestru) {
      queryObject.isSechestru = 1;
    }

    if (isArest) {
      queryObject.isArest = 1;
    }

    if (isControlJudiciar) {
      queryObject.isControlJudiciar = 1;
    }
  }

  try {
    dosare = await Dosar.findAll({ where: queryObject });
    totalItems = dosare.length;

    let dosareToSend = await Promise.all(
      dosare.map(async (dosar) => {
        const procuror = await User.findByPk(dosar.procurorId);
        let numeProcuror = "null";
        if (procuror) {
          numeProcuror = procuror.name;
        }
        return {
          id: dosar.id,
          numar: dosar.numar,
          numar_fost: dosar.numar_fost,
          isControlJudiciar: dosar.isControlJudiciar,
          isArest: dosar.isArest,
          isSechestru: dosar.isSechestru,
          data: dosar.data,
          userId: dosar.userId,
          data_arest: dosar.data_arest,
          data_cj: dosar.data_cj,
          data_sechestru: dosar.data_sechestru,
          procurorId: dosar.procurorId,
          este_solutionat: dosar.este_solutionat,
          numeProcuror: numeProcuror,
          isInterceptari: dosar.isInterceptari,
          data_interceptari: dosar.data_interceptari,
          tip_solutie_propusa: dosar.tip_solutie_propusa,
          tip_solutie: dosar.tip_solutie,
          este_solutionat: dosar.este_solutionat,
          days_remaining: dosar.days_remaining,
          data_inceperii_la_procuror: dosar.data_inceperii_la_procuror,
          data_primei_sesizari: dosar.data_primei_sesizari,
          prima_institutie_sesizata: dosar.prima_institutie_sesizata,
          institutia_curenta: dosar.institutia_curenta,
          data_solutie_reala: dosar.data_solutie_reala,
          trimis_masura_la_instanta: dosar.trimis_masura_la_instanta || "0",
          admitere_contestatie: dosar.admitere_contestatie || null,
          termen_contestatie: dosar.termen_contestatie,
        };
      })
    );

    let sortedDosare = dosareToSend.sort(
      (a, b) => new Date(a.data) - new Date(b.data)
      // new Date(a.data).getTime() < new Date(b.data).getTime ? 1 : -1
    );

    res.status(200).json({ dosare: sortedDosare, totalItems: totalItems });
  } catch (error) {
    next(error);
  }
};

exports.getDosarById = async (req, res, next) => {
  let dosar;
  let parte;
  let fapta;

  let pedeapsa;

  const dosarId = req.params.dosarId;

  try {
    dosar = await Dosar.findAll({ where: { id: dosarId } });
    if (dosar) {
      parte = await Part.findAll({ where: { numar_dosar: dosar[0].numar } });
      fapta = await Doing.findAll({
        where: { numar_dosar: dosar[0].numar },
      });
    }

    if (!dosar) {
      const error = new Error("Acest dosar nu exista.");
      error.statusCode = 404;
      throw error;
    }

    let infractiune = [];

    if (fapta[fapta.length - 1]) {
      if (fapta[fapta.length - 1].nume_temei.includes("199")) {
        const articol = fapta[0].nume_temei.split(" ")[0].split(".")[1];
        let alineat = 1;
        if (fapta[0].nume_temei.includes("alin.")) {
          alineat = fapta[0].nume_temei.split(" ")[1].split(".")[1];
        }

        infractiune = await Infractiuni.findAll({
          where: { articol: articol },
        });

        let pedeapsa = [];

        if (infractiune && infractiune.length > 0) {
          pedeapsa = await Pedepse.findAll({
            where: { id_infractiune: infractiune[0].id, alineat: alineat },
          });
        }

        if (pedeapsa.length > 0) {
          dosar[0].dataValues.pedeapsa = pedeapsa[0].nume_pe_scurt;
        }
      } else {
        const articol = fapta[fapta.length - 1].nume_temei
          .split(" ")[0]
          .split(".")[1];
        let alineat = 1;
        if (fapta[fapta.length - 1].nume_temei.includes("alin.")) {
          alineat = fapta[fapta.length - 1].nume_temei
            .split(" ")[1]
            .split(".")[1];
        }

        infractiune = await Infractiuni.findAll({
          where: { articol: articol },
        });

        let pedeapsa = [];

        if (infractiune && infractiune.length > 0) {
          pedeapsa = await Pedepse.findAll({
            where: { id_infractiune: infractiune[0].id, alineat: alineat },
          });
        }

        if (pedeapsa.length > 0) {
          dosar[0].dataValues.pedeapsa = pedeapsa[0].nume_pe_scurt;
        }
      }
    }

    if (infractiune.length > 0 && infractiune[0].copil) {
      let parinte_infractiune = await Infractiuni.findAll({
        where: { id: infractiune[0].copil },
      });
      dosar[0].dataValues.infractiuneParinte = parinte_infractiune[0];
    }

    dosar[0].dataValues.parte = parte;
    dosar[0].dataValues.fapta = fapta;
    dosar[0].dataValues.infractiune = infractiune;

    res.status(200).json({ dosar: dosar[0] });
  } catch (err) {
    next(err);
  }
};

exports.getDosareByUserId = async (req, res, next) => {
  let dosare = [];
  let totalItems = 0;

  let userId = req.query.userId;

  try {
    dosare = await Dosar.findAll(where, { procurorId: userId });
    totalItems = dosare.length;

    res.status(200).json({ dosare: dosare, totalItems: totalItems });
  } catch (err) {
    next(err);
  }
};

exports.getDosareByCategory = async (req, res, next) => {
  let dosare = [];
  let totalItems = 0;
  let type = req.query.type;

  const isSechestru = type === 1;
  const isArest = type === 2;
  const isControlJudiciar = type === 3;

  let queryObject;

  if (isSechestru) {
    queryObject = { isSechestru: isSechestru };
  }

  if (isArest) {
    queryObject = { isArest: isArest };
  }

  if (isControlJudiciar) {
    queryObject = { isControlJudiciar: isControlJudiciar };
  }

  try {
    dosare = await Dosar.findAll({ where: { queryObject } });
    totalItems = dosare.length;

    res.status(200).json({ dosare: dosare, totalItems: totalItems });
  } catch (err) {
    next(err);
  }
};

exports.cleanDataBaseCuAc = async (req, res, next) => {
  await Dosar.destroy({
    where: { institutia_curenta: { [op.ne]: null } },
  });

  res.status(200).json({
    message: "clean dosare ac",
  });
};

exports.cleanDataBaseDosar = async (req, res, next) => {
  await Dosar.destroy({
    where: {
      isControlJudiciar: "0",
      isSechestru: "0",
      institutia_curenta: null,
    },
  });

  res.status(200).json({
    message: "clean dosare",
  });
};

exports.cleanDataBaseSechestru = async (req, res, next) => {
  await Dosar.destroy({
    where: { isSechestru: "1" },
  });

  res.status(200).json({
    message: "clean sechestru",
  });
};

exports.cleanDataBaseMasuri = async (req, res, next) => {
  await Dosar.destroy({
    where: { isControlJudiciar: "1" },
  });

  await Dosar.destroy({
    where: { isArest: "1" },
  });

  res.status(200).json({
    message: "clean masuri",
  });
};

exports.cleanDataBaseContestatii = async (req, res, next) => {
  await Dosar.destroy({
    where: { admitere_contestatie: "1" },
  });

  res.status(200).json({
    message: "clean contestatii",
  });
};

exports.addDosar = async (req, res, next) => {
  const errors = validationResult(req);
  let isContestatie = false;

  if (
    req.body.calea_completa &&
    req.body.calea_completa.includes("Soluţionare-Admitere contestaţie")
  ) {
    isContestatie = true;
  }

  try {
    if (!errors.isEmpty) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.status = 422;
      error.data = errors.array();
      throw error;
    }

    let data;
    let days_remaining = null;

    let tip_data_cu_punct = false;

    if (req.body.data_inceperii) {
      data = req.body.data_inceperii;

      dataArray = [];

      if (req.body.data_inceperii.split(" ")[0].includes("/")) {
        dataArray = req.body.data_inceperii.split(" ")[0].split("/");
      }

      if (req.body.data_inceperii.split(" ")[0].includes(".")) {
        tip_data_cu_punct = true;
        dataArray = req.body.data_inceperii.split(" ")[0].split(".");
      }

      if (dataArray[0].length === 1) {
        dataArray[0] = "0" + dataArray[0];
      }

      if (dataArray[1].length === 1) {
        dataArray[1] = "0" + dataArray[1];
      }

      if (tip_data_cu_punct) {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[1] +
          "-" +
          dataArray[0] +
          "T01:00:00.000Z";
      } else {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[0] +
          "-" +
          dataArray[1] +
          "T01:00:00.000Z";
      }

      data = dataNoua;
    }

    if (req.body.data_sesizarii_primei) {
      data = req.body.data_sesizarii_primei;
    }

    if (req.body.data_expirarii_mandat) {
      data = req.body.data_expirarii_mandat;
      days_remaining = req.body.days_remaining;
    }

    let numar;

    if (req.body.data_expirarii_mandat) {
      numar = req.body.numar;
    } else {
      numar = req.body.numar_dosar;
    }

    if (req.body.date_undertaking) {
      data = req.body.date_undertaking;
      days_remaining = req.body.days_remaining;

      let tip_data_cu_punct = false;

      if (req.body.date_undertaking.split(" ")[0].includes("/")) {
        dataArray = req.body.date_undertaking.split(" ")[0].split("/");
      }

      if (req.body.date_undertaking.split(" ")[0].includes(".")) {
        dataArray = req.body.date_undertaking.split(" ")[0].split(".");

        tip_data_cu_punct = true;
      }

      if (dataArray[0].length === 1) {
        dataArray[0] = "0" + dataArray[0];
      }

      if (dataArray[1].length === 1) {
        dataArray[1] = "0" + dataArray[1];
      }

      if (tip_data_cu_punct) {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[1] +
          "-" +
          dataArray[0] +
          "T01:00:00.000Z";
      } else {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[0] +
          "-" +
          dataArray[1] +
          "T01:00:00.000Z";
      }

      data = dataNoua;

      numar = req.body.numar;
    }

    const type = req.body.type;

    let data_inceperii_la_procuror;

    if (req.body.data_inceperii_la_procuror) {
      data_inceperii_la_procuror = req.body.data_inceperii_la_procuror;

      dataArray = [];

      let tip_data_cu_punct = false;

      if (req.body.data_inceperii_la_procuror.split(" ")[0].includes("/")) {
        dataArray = req.body.data_inceperii_la_procuror
          .split(" ")[0]
          .split("/");
      }

      if (req.body.data_inceperii_la_procuror.split(" ")[0].includes(".")) {
        dataArray = req.body.data_inceperii_la_procuror
          .split(" ")[0]
          .split(".");
        tip_data_cu_punct = true;
      }

      if (dataArray[0].length === 1) {
        dataArray[0] = "0" + dataArray[0];
      }

      if (dataArray[1].length === 1) {
        dataArray[1] = "0" + dataArray[1];
      }

      if (tip_data_cu_punct) {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[1] +
          "-" +
          dataArray[0] +
          "T01:00:00.000Z";
      } else {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[0] +
          "-" +
          dataArray[1] +
          "T01:00:00.000Z";
      }

      data_inceperii_la_procuror = dataNoua;
    }

    const data_sechestru = req.body.data_sechestru;
    const data_arest = req.body.data_arest;
    const data_cj = req.body.data_cj;
    const procurorId = req.body.id_procuror;
    const data_interceptari = req.body.data_interceptari;
    let tip_solutie_propusa = req.body.tip_solutie_propusa;

    const data_primei_sesizari = req.body.data_sesizarii_primei || null;

    const prima_institutie_sesizata =
      req.body.prima_institutie_sesizata || null;

    console.log(prima_institutie_sesizata);

    let institutia_curenta = req.body.institutia_curenta || null;

    if (
      tip_solutie_propusa &&
      tip_solutie_propusa.includes("cu propunere de")
    ) {
      tip_solutie_propusa = tip_solutie_propusa.split("cu propunere de")[1];
      // tip_solutie_propusa = tip_solutie_propusa.split(" ")[0];
    } else {
      tip_solutie_propusa = "";
    }

    const procuror_nume = req.body.nume + " " + req.body.prenume;

    let isSechestru = false;
    let isArest = false;
    let isControlJudiciar = false;
    let isInterceptari = false;

    if (data_sechestru) {
      isSechestru = true;
    }

    let data_expirarii_mandat = req.body.data_expirarii_mandat;

    if (req.body.data_expirarii_mandat) {
      data = req.body.data_expirarii_mandat;

      let tip_data_cu_punct = false;

      if (req.body.data_expirarii_mandat.split(" ")[0].includes("/")) {
        dataArray = req.body.data_expirarii_mandat.split(" ")[0].split("/");
      }

      if (req.body.data_expirarii_mandat.split(" ")[0].includes(".")) {
        dataArray = req.body.data_expirarii_mandat.split(" ")[0].split(".");
        tip_data_cu_punct = true;
      }

      if (dataArray[0].length === 1) {
        dataArray[0] = "0" + dataArray[0];
      }

      if (dataArray[1].length === 1) {
        dataArray[1] = "0" + dataArray[1];
      }

      if (tip_data_cu_punct) {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[1] +
          "-" +
          dataArray[0] +
          "T01:00:00.000Z";
      } else {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[0] +
          "-" +
          dataArray[1] +
          "T01:00:00.000Z";
      }

      data = dataNoua;
    }

    if (
      (req.body.data_expirarii_mandat &&
        req.body.nume_masura_preventiva.includes("control")) ||
      (req.body.nume_masura_preventiva &&
        req.body.nume_masura_preventiva.includes("Control"))
    ) {
      isControlJudiciar = true;
    }

    if (
      (req.body.data_expirarii_mandat &&
        req.body.nume_masura_preventiva.includes("arest")) ||
      (req.body.nume_masura_preventiva &&
        req.body.nume_masura_preventiva.includes("Arest"))
    ) {
      isArest = true;
    }

    if (req.body.date_undertaking) {
      isSechestru = true;
    }

    if (data_interceptari) {
      isInterceptari = true;
    }

    // if (!req.body.data_expirarii_mandat) {
    //   const data1 = data.split(" ")[0];
    //   const day = data1.split(".")[0];
    //   const month = data1.split(".")[1];
    //   const year = data1.split(".")[2];

    //   data = data1;
    // }

    let data_solutie_reala = null;

    if (req.body.data_solutie_reala) {
      data_solutie_reala = formatDate(req.body.data_solutie_reala);
    }

    if (req.body.data_expirarii_mandat) {
      data = req.body.data_expirarii_mandat;

      let tip_data_cu_punct = false;

      if (req.body.data_expirarii_mandat.split(" ")[0].includes("/")) {
        dataArray = req.body.data_expirarii_mandat.split(" ")[0].split("/");
      }

      if (req.body.data_expirarii_mandat.split(" ")[0].includes(".")) {
        dataArray = req.body.data_expirarii_mandat.split(" ")[0].split(".");
        tip_data_cu_punct = true;
      }

      if (dataArray[0].length === 1) {
        dataArray[0] = "0" + dataArray[0];
      }

      if (dataArray[1].length === 1) {
        dataArray[1] = "0" + dataArray[1];
      }

      if (tip_data_cu_punct) {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[1] +
          "-" +
          dataArray[0] +
          "T22:00:00.000Z";
      } else {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[0] +
          "-" +
          dataArray[1] +
          "T22:00:00.000Z";
      }

      data_expirarii_mandat = dataNoua;

      data = data_expirarii_mandat;
    }

    if (req.body.data_sesizarii_primei) {
      console.log("--------------------");
      console.log(data);
      console.log("----------------------");

      let tip_data_cu_punct = false;

      if (data.split(" ")[0].includes("/")) {
        dataArray = data.split(" ")[0].split("/");
      }

      if (data.split(" ")[0].includes(".")) {
        dataArray = data.split(" ")[0].split(".");
        tip_data_cu_punct = true;
      }

      if (dataArray[0].length === 1) {
        dataArray[0] = "0" + dataArray[0];
      }

      if (dataArray[1].length === 1) {
        dataArray[1] = "0" + dataArray[1];
      }

      let dataNoua;

      if (tip_data_cu_punct) {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[1] +
          "-" +
          dataArray[0] +
          "T22:00:00.000Z";
      } else {
        dataNoua =
          dataArray[2] +
          "-" +
          dataArray[0] +
          "-" +
          dataArray[1] +
          "T22:00:00.000Z";
      }

      data = dataNoua;
    }

    //console.log(data);

    //console.log("daysREmaining  ", days_remaining);

    /// 2023-08-01 corect
    /// 01.09.2022

    if (req.body.invest_proprie === "True") {
      tip_solutie_propusa = "UPP";
    }

    let admitere_contestatie = 0;
    let termen_contestatie = null;

    if (
      req.body.calea_completa &&
      req.body.calea_completa.includes("Soluţionare-Admitere contestaţie")
    ) {
      admitere_contestatie = 1;
      termen_contestatie = formatDate(req.body.data_termen);
      numar = req.body.numar;
      data = formatDate(req.body.data_termen);
    }

    const dosar = await Dosar.create({
      id_dosar: req.body.id,
      numar: numar,
      numar_fost: req.body.numar_fost,
      data: data,
      isSechestru: isSechestru,
      isArest: isArest,
      isControlJudiciar: isControlJudiciar,
      isInterceptari: isInterceptari,
      data_arest: data_arest,
      data_sechestru: data_sechestru,
      data_cj: data_cj,
      data_interceptari: data_interceptari,
      userId: req.userId,
      procurorId: procurorId,
      tip_solutie_propusa: tip_solutie_propusa,
      days_remaining: days_remaining,
      data_inceperii_la_procuror: data_inceperii_la_procuror,
      data_primei_sesizari: data,
      prima_institutie_sesizata: prima_institutie_sesizata,
      institutia_curenta: institutia_curenta,
      data_solutie_reala: data_solutie_reala || null,
      parte: req.body.nume_parte || null,
      trimis_masura_la_instanta: req.body.trimis_masura_la_instanta || null,
      admitere_contestatie: admitere_contestatie,
      termen_contestatie: termen_contestatie,
    });

    const procuror = await User.findByPk(procurorId);

    if (!procuror) {
      await User.create({
        id: procurorId,
        name: procuror_nume,
        email: "proc" + procurorId,
        isProcuror: 1,
        password: "1234",
        repeatPassword: req.body.prenume,
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

exports.editDosar = async (req, res, next) => {
  const errors = validationResult(req);
  const dosarId = req.params.dosarId;
  let dosarNumar = dosarId.split("separator")[0];
  const parte = dosarId.split("separator")[1];
  let dosIntermediar = [];

  dosarNumar =
    dosarNumar.split("-")[0] +
    "/" +
    dosarNumar.split("-")[1] +
    "/" +
    dosarNumar.split("-")[2];

  try {
    if (!errors.isEmpty) {
      const error = new Error("Datele introduse nu sunt corecte!");
      error.statusCode = 422;
      throw error;
    }

    //const dosar = await Dosar.findByPk(dosarId);

    const dosare = await Dosar.findAll({
      where: { numar: dosarNumar, parte: parte },
    });

    dosare.map((dos) => {
      if (dos.isArest || dos.isControlJudiciar) dosIntermediar.push(dos);
    });

    let dosar = await Dosar.findByPk(dosIntermediar[0].id);

    const user = await User.findByPk(req.userId);

    const isProcuror = user.isProcuror;

    if (dosar.userId !== req.userId && !isProcuror) {
      console.log("test");
      const error = new Error(
        "Nu sunteti autorizat. Dosarul nu este introdus de dvs!"
      );
      error.statusCode = 422;
      throw error;
    }

    dosar.trimis_masura_la_instanta = 1;

    await dosar.save();

    res.status(200).json({
      dosar: dosar,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteDosar = async (req, res, next) => {
  const dosarId = req.params.dosarId;

  try {
    const dosar = await Dosar.findByPk(dosarId);

    if (!dosar) {
      const error = new Error("Nu exista acest dosar!");
      error.statusCode = 403;
      throw error;
    }

    if (dosar.userId !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    await dosar.destroy();

    res.status(200).json({ message: "Dosar sters!" });
  } catch (err) {
    next(err);
  }
};

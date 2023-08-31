const { validationResult } = require("express-validator");
const Dosar = require("../models/dosar");
const User = require("../models/user");

exports.getDosare = async (req, res, next) => {
  let dosare = [];
  let totalItems = 0;
  let type = req.query.type;
  let dosar_name = req.query.dosar_name;

  let procurorId = req.query.procurorId;
  let isAdmin = req.query.isAdmin;
  let este_solutionat = req.query.este_solutionat;

  let queryObject = {};

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
        const numeProcuror = procuror.name;
        return {
          id: dosar.id,
          numar: dosar.numar,
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
          days_remaining: dosar.days_remaining
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
  const dosarId = req.params.dosarId;

  try {
    dosar = await Dosar.findAll({ where: { id: dosarId } });
    if (!dosar) {
      const error = new Error("Acest dosar nu exista.");
      error.statusCode = 404;
      throw error;
    }

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

exports.cleanDataBaseDosar = async (req, res, next) => {
  await Dosar.destroy({
    where: {isControlJudiciar: "0"}
  })

  res.status(200).json({
    message: "clean dosare",
  });
}

exports.cleanDataBaseMasuri = async (req, res, next) => {
  await Dosar.destroy({
    where: {isControlJudiciar: "1"}
  })

  res.status(200).json({
    message: "clean masuri",
  });
}

exports.addDosar = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.status = 422;
      error.data = errors.array();
      throw error;
    }

    let data;
    let days_remaining = null;

    if (req.body.data_inceperii) {
      data = req.body.data_inceperii;
   
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

    const type = req.body.type;
    
    const data_sechestru = req.body.data_sechestru;
    const data_arest = req.body.data_arest;
    const data_cj = req.body.data_cj;
    const procurorId = req.body.id_procuror;
    const data_interceptari = req.body.data_interceptari;
    const tip_solutie_propusa = req.body.tip_solutie_propusa;

    const procuror_nume = req.body.nume + " " + req.body.prenume;

    let isSechestru = false;
    let isArest = false;
    let isControlJudiciar = false;
    let isInterceptari = false;

    if (data_sechestru) {
      isSechestru = true;
    }

    if (req.body.data_expirarii_mandat) {
      isArest = true;
    }

    if (req.body.data_expirarii_mandat) {
      isControlJudiciar = true;
    }

    if (data_interceptari) {
      isInterceptari = true;
    }

    if (!req.body.data_expirarii_mandat) {
      const data1 = data.split(" ")[0];
      const day = data1.split(".")[0];
      const month = data1.split(".")[1];
      const year = data1.split(".")[2];

      data = year + "-" + month + "-" + day;
    }


    console.log("daysREmaining  ",days_remaining);
    

    /// 2023-08-01 corect
    /// 01.09.2022

    // await Dosar.destroy({
    //   where: {
    //     numar: numar,
    //   },
    // });

    const dosar = await Dosar.create({
      numar: numar,
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
      days_remaining: days_remaining
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
      console.log("procuror exists")
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
  const userId = req.userId;

  const numar = req.body.numar;
  const type = req.body.type;
  const data = req.body.data;
  const data_sechestru = req.body.data_sechestru;
  const data_arest = req.body.data_arest;
  const data_cj = req.body.data_cj;
  const procurorId = req.body.procurorId;
  const este_solutionat = req.body.este_solutionat === "true" ? 1 : 0;
  const data_interceptari = req.body.data_interceptari;
  const tip_solutie = req.body.tip_solutie;
  const tip_solutie_propusa = req.body.tip_solutie_propusa;

  try {
    if (!errors.isEmpty) {
      const error = new Error("Datele introduse nu sunt corecte!");
      error.statusCode = 422;
      throw error;
    }

    const dosar = await Dosar.findByPk(dosarId);

    const user = await User.findByPk(req.userId);

    const isProcuror = user.isProcuror;

    if (dosar.userId !== req.userId && !isProcuror) {
      const error = new Error(
        "Nu sunteti autorizat. Dosarul nu este introdus de dvs!"
      );
      error.statusCode = 422;
      throw error;
    }

    dosar.numar = numar || dosar.numar;
    dosar.data = data;
    dosar.data_sechestru = data_sechestru || null;
    dosar.data_arest = data_arest || null;
    dosar.data_cj = data_cj || null;
    dosar.procurorId = procurorId;
    const type = req.body.type;
    dosar.este_solutionat = este_solutionat || 0;
    dosar.data_interceptari = data_interceptari || null;
    dosar.tip_solutie = tip_solutie;
    dosar.tip_solutie_propusa = tip_solutie_propusa;

    if (este_solutionat === 0) {
      dosar.tip_solutie = null;
    }

    if (data_sechestru) {
      dosar.isSechestru = true;
    } else {
      dosar.isSechestru = false;
    }

    if (data_arest) {
      dosar.isArest = true;
    } else {
      dosar.isArest = false;
    }

    if (data_cj) {
      dosar.isControlJudiciar = true;
    } else {
      dosar.isControlJudiciar = false;
    }

    if (data_interceptari) {
      dosar.isInterceptari = true;
    } else {
      dosar.isInterceptari = false;
    }

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

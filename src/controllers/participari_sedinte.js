const Participare = require("../models/participari_sedinte");
const User = require("../models/user");

exports.getParticipariPenal = async (req, res, next) => {
  let participari = [];
  let totalItems = 0;

  queryObject = {};


  let procurorId = req.query.procurorId;
  let isAdmin = req.query.isAdmin;

  let civil = req.query.civil;



  if (!procurorId && isAdmin !== "1") {
    queryObject.userId = req.userId;
  }

  if (procurorId === "1") {
    queryObject.id_procuror = req.userId;
  }

  queryObject.tip_sedinta = 1;


  console.log(civil);

  if(civil === "1") {
    queryObject.tip_sedinta = 2;
  }

  try {
    participari = await Participare.findAll({ where: queryObject, order:[ ["data", "ASC"] ]});
    totalItems = participari.length;


    let participariToSend = await Promise.all(
      participari.map(async (itemData) => {
        const procuror = await User.findByPk(itemData.id_procuror);
        let numeProcuror = "null";
        if (procuror) {
          numeProcuror = procuror.name;
        }
        return {
          id: itemData.id,
          nr_part_sed: itemData.nr_part_sed,
          nr_part_cauze: itemData.nr_part_cauze,
          nr_hot_vf: itemData.nr_hot_vf,
          nr_part_sed_copil: itemData.nr_part_sed_copil,
          nr_part_copil: itemData.nr_part_copil,
          nr_hot_vf_copil: itemData.nr_hot_vf_copil,
          id_procuror: itemData.id_procuror,
          numeProcuror: numeProcuror,
          an: itemData.an,
          luna: itemData.luna,
          data: itemData.data
        };
      })
    );

    let sortedData = participariToSend.sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );

    res.status(200).json({ participari: sortedData, totalItems: totalItems });
  } catch (error) {
    next(error);
  }
};

exports.addParicipare = async (req, res, next) => {
  try {
    let participare = await Participare.findAll({where: {an: req.body.an, luna: req.body.luna, id_procuror: req.body.id_procuror, tip_sedinta: req.body.type_hearing}})
   
    console.log(participare)

    if(participare.length === 0) {
   
      participare = await Participare.create({
        data: req.body.data,
        an: req.body.an,
        luna: req.body.luna,
        id_procuror: req.body.id_procuror,
        nr_part_sed: req.body.no_participations_hearing || 0,
        nr_part_cauze: req.body.no_case_judged || 0, 
        nr_hot_vf: req.body.no_total_decision || 0,
        nr_part_sed_copil: req.body.no_participations_hearing_child || 0,
        nr_part_copil: req.body.no_case_judged_child || 0,
        nr_hot_vf_copil: req.body.no_decision_child || 0,
        tip_sedinta: req.body.type_hearing || 0,
      });
    } else {

      participare[0].nr_part_sed = parseInt(participare[0].nr_part_sed) + parseInt(req.body.no_participations_hearing);
      participare[0].nr_part_cauze = parseInt(participare[0].nr_part_cauze) + parseInt(req.body.no_case_judged);
      participare[0].nr_hot_vf = parseInt(participare[0].nr_hot_vf) + parseInt(req.body.no_total_decision);
      participare[0].nr_part_sed_copil = parseInt(participare[0].nr_part_sed_copil) + parseInt(req.body.no_participations_hearing_child);
      participare[0].nr_part_copil = parseInt(participare[0].nr_part_copil) + parseInt(req.body.no_case_judged_child);
      participare[0].nr_hot_vf_copil = parseInt(participare[0].nr_hot_vf_copil) + parseInt(req.body.no_decision_child);
    
      participare[0].save();
    }

    const procuror = await User.findByPk(req.body.id_procuror);



    if (!procuror) {
      await User.create({
        id: req.body.id_procuror,
        name: req.body.nume_procuror,
        email: "proc" + req.body.id_procuror,
        isProcuror: 1,
        password: "1234",
        repeatPassword: "1234",
      });
    } else {
      console.log("procuror exists");
    }

    res.status(200).json({
      participare: participare,
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

  await Participare.destroy({
    where: {}
  });

  res.status(200).json({
    message: "clean participari",
  });
};

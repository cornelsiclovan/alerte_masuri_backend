const Sequelize = require("sequelize");
const Arestat = require("../models/arestati");

const op = Sequelize.Op;

exports.getArestati = async (req, res, next) => {
    let arestati = [];
    const an = req.body.an;
    const cj = req.body.cj;

    let queryObject = {};

    if (an) {
        queryObject.data = { [op.like]: an.split("-")[0] };
    }

    if (cj) {
        queryObject.isCj = 1;
    }

    try {
        arestati = await Arestat.findAll({ where: queryObject });
        if (!arestati) {
            const error = new Error("Nu exista arestati pe criteriile solicitate");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ arestati: arestati });
    } catch (err) {
        next(err);
    }
};

exports.postArestati = async (req, res, next) => {
    console.log("test")

    try {
        if (!req || !req.body) {
            console.log(error);
            throw new Error("No body");
        }

        const isCj = req.body.nume.includes("judiciar") ? "1" : "0"

        const arestat = await Arestat.create({
            numar_dosar: req.body.numar || "",
            nume: req.body.nume || "test",
            data: req.body.data_start || "",
            nume_parte: req.body.nume_parte || " - ",
            durata: req.body.durata || "",
            isCj: isCj
        });

        res.status(200).json({
            arestat: arestat,
        });
    } catch (err) {

        console.log(err);
        console.log(req.body);
        if (!err.statusCode) {
            err.statusCode = 404;

        }
        next(err);
    }
}


exports.cleanArestati = async (req, res, next) => {
    await Arestat.destroy({ where: {} });

    res.status(200).json({
      message: "clean arestati",
    });
}
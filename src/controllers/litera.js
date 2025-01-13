const Sequelize = require("sequelize");
const Alineat = require("../models/alineat");
const Litera = require("../models/litera");

const op = Sequelize.Op;

exports.getLitereByIdAlineat = async (req, res, next) => {
    let litere;
    const id_alineat = req.params.id_alineat;

    try {
        litere = await Litera.findAll({ where: { id_alineat: id_alineat } });
        if (!dosar) {
            const error = new Error("Acest dosar nu exista.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ litere: litere });
    } catch (err) {
        next(err);
    }
};

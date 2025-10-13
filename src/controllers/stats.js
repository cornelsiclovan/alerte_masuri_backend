const Sequelize = require("sequelize");
const Stats = require("../models/stat");

const op = Sequelize.Op;

exports.getStats = async (req, res, next) => {
    let stats;
    let statsLunare;
    let accesari_lunare = 0;
    let accesari_total = 0;
    let solutii = 0;
    let note_indrumare = 0;

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth(); // +1 is correct

    try {
        stats = await Stats.findAll();
        statsLunare = await Stats.findAll({ where: { month: currentMonth, year: currentYear } })

        stats.forEach(element => {
            accesari_total = accesari_total + element.login_count;
            solutii = solutii + element.file_count;
            note_indrumare = note_indrumare + element.note_indrumare_count;
        });

        statsLunare.forEach(element => {
            accesari_lunare = accesari_lunare + element.login_count;
        });

        

        res.status(200).json(
            {
                accesari_lunare: accesari_lunare,
                accesari_total: accesari_total,
                solutii: solutii,
                note_indrumare: note_indrumare
            });
    } catch (err) {
        next(err);
    }
};

exports.postStat = async (req, res, next) => {
    let user_id = req.userId;
    let operation = req.query.operation;

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth(); // +1 is correct

    try {
        let stat = await Stats.findOne({ where: { month: currentMonth, year: currentYear, user_id: user_id } });

        if (stat) {
            if (operation === 'login') {
                stat.login_count = stat.login_count + 1;
            }

            if (operation === 'solutie') {
                stat.file_count = stat.file_count + 1;
            }

            if (operation === 'nota_indrumare') {
                stat.note_indrumare_count = stat.note_indrumare_count + 1;
            }

            await stat.save()

        } else {
            await Stats.create({
                user_id: user_id,
                month: currentMonth,
                year: currentYear,
                login_count: operation === 'login' ? 1 : 0,
                file_count: operation === 'solutie' ? 1 : 0,
                note_indrumare_count: operation === 'nota_indrumare' ? 1 : 0
            })
        }

        res.send("success");
    } catch (err) {
        next(err);
    }

    console.log(operation)
}  
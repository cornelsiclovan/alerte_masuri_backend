const { Sequelize, where } = require("sequelize");
const Indrumator = require("../models/indrumator");
const IndrumatorTask = require("../models/indrumator_task");
const Task = require("../models/task");
const TaskType = require("../models/task_type");
const User = require("../models/user");
const Dosar = require("../models/dosar");

const op = Sequelize.Op;

exports.getIndrumators = async (req, res, next) => {
    let queryObject = {};
    let dosare;
    let indrumatoare;
    let tasks;


    let procurorId = req.query.procurorId;
    if (procurorId === "1") {
        queryObject.procurorId = req.userId;
    }

    try {
        let dosarecuIndrumator = await Indrumator.findAll();
        let dosareFinale = [];

        for (const dos of dosarecuIndrumator) {
            if (dos !== null) {
                let dos2 = await Dosar.findOne({ where: queryObject })
                dosareFinale.push(dos2)
            }

        }

        // dosare = await Dosar.findAll({ where: queryObject });
        // console.log(dosareFinale)


        //console.log(dosareFinale)
        const testIndrumatoare = [];

        for (const dosar of dosareFinale) {
            //console.log(dosar)
            let indrumator = await Indrumator.findOne({ where: { id_dosar: dosar.id_dosar } });
            let procuror = await User.findOne({ where: { id: dosar.procurorId } });



            if (indrumator) {

                temp = indrumator;
                tasks = await IndrumatorTask.findAll({ where: { id_indrumator: indrumator.id } })

                testIndrumatoare.push({
                    id_indrumator: temp.id,
                    dosar: dosar.numar,
                    dosar_id: dosar.id,
                    procuror: procuror.name,
                    tasks: tasks,
                    termen: temp.termen,
                    id_procuror: dosar.procurorId
                })
            }
        }


        let indrumatoareToSend = testIndrumatoare.filter(indrumator => {

            return indrumator !== undefined
        })

        let newToSend = [];

        indrumatoareToSend.reduce((acc, curr) => {
            if (acc.indexOf(curr.id_indrumator) === -1) {
                acc.push(curr.id_indrumator);
                newToSend.push(curr);
            }
            return acc
        }, [])

        // indrumatoare = await Indrumator.findAll();
        // let indrumatoareToSend = await Promise.all(
        //     indrumatoare.map(async indrumator => {
        //         tasks = await IndrumatorTask.findAll({ where: { id_indrumator: indrumator.id } })
        //         return {
        //             id: indrumator.id,
        //             tasks: tasks
        //         }
        //     })
        // );


        let sorted = newToSend.sort((a, b) =>
            new Date(a.termen) - new Date(b.termen)
        )

        res.send(sorted);
    } catch (error) {
        res.send(error);
    }
}


exports.getIndrumatorByDosarId = async (req, res, next) => {
    let id_dosar = req.params.id_dosar;

    try {
        let indrumator = await Indrumator.findOne({ where: { id_dosar: id_dosar } })
        let indrumator_tasks = await IndrumatorTask.findAll({ where: { id_indrumator: indrumator.id } })

        let indrumatorToSend = {
            id: indrumator.id,
            termen: indrumator.termen,
            tasks: indrumator_tasks
        }

        if (indrumator) {
            res.send(indrumatorToSend);
        } else {
            res.send({ message: "error" })
        }

    } catch (error) {
        res.send(error);
    }
}

exports.createIndrumator = async (req, res, next) => {
    let indrumatortoSend;
    let tasks = [];
    const id_dosar = req.body.id_dosar;
    const termen = req.body.termen;
    const taskids = req.body.taskids;
    const status = req.body.status || 0;

    try {
        let indrumator = await Indrumator.findOne({ where: { id_dosar: id_dosar } });

        let dosar = await Dosar.findOne({ where: { id_dosar: id_dosar } });
        let procuror = await User.findOne({ where: { id: dosar.procurorId } });

        if (procuror.id === req.userId) {
            if (indrumator) {
                indrumator.termen = termen;
                await indrumator.save();
            } else {
                indrumator = await Indrumator.create({
                    id_dosar,
                    termen
                });

            }
            res.send(indrumator);
        } else { res.send("cannot set indrumator to other user") }

        // taskids.forEach(async taskid => {
        //     let indrumatorTask = await IndrumatorTask.create({
        //         id_indrumator: indrumator.id,
        //         id_task: taskid,
        //         status: status,
        //     })

        // });




    } catch (error) {
        res.send(error);
    }
}

exports.editIndrumator = async (req, res, next) => {
    const id_task = req.params.taskId;
    const status = req.body.status;

    try {
        let task = await IndrumatorTask.findOne({ where: { id: id_task } });


        let indrumator = await Indrumator.findOne({ where: { id: task.id_indrumator } });
        let dosar = await Dosar.findOne({ where: { id_dosar: indrumator.id_dosar } });
        let procuror = await User.findOne({ where: { id: dosar.procurorId } });

        if (req.userId === procuror.id) {

            if (task) {

                task.status = status;
                await task.save();
            }
            res.send("success");
        } else {
            res.send("user is not owner")
        }

    } catch (error) {
        res.send(error);
    }
}

exports.setTaskToIndrumator = async (req, res, next) => {
    let indrumatorId = req.params.indrumatorId;
    let nota = req.body.nota;
    let taskId = req.body.id_task;
    let status = req.body.status || 0

    let indrumator = await Indrumator.findOne({ where: { id: indrumatorId } });
    let dosar = await Dosar.findOne({ where: { id_dosar: indrumator.id_dosar } });
    let procuror = await User.findOne({ where: { id: dosar.procurorId } });


    try {
        let task = await Task.findOne({ where: { id: taskId } });
        let task_type = await TaskType.findOne({ where: { id: task.type_id } })

        let task_type_nume = task_type.nume
        if (task_type.id === 3) {
            task_type_nume = ""
        }

        console.log(procuror.id, req.userId)

        if (req.userId === procuror.id) {
            let indrumatorTask = await IndrumatorTask.create({
                id_indrumator: indrumatorId,
                nota: nota,
                id_task: taskId,
                task_type: task_type_nume,
                task_name: task.nume,
                status: status
            })
            res.send(indrumatorTask);
        } else {
            res.send("user cannot set indrumator");
        }

        // let indrumatorTask = await IndrumatorTask.create({
        //     id_indrumator: indrumatorId,
        //     nota: nota,
        //     id_task: taskId,
        //     task_type: task_type_nume,
        //     task_name: task.nume,
        //     status: status
        // })


    } catch (error) {
        res.send(error)
    }
}

exports.getIndrumatorTasksByIdIndrumator = async (req, res, next) => {
    const indrumatorId = req.query.indrumatorId;

    try {
        let indrumatorTasks = await IndrumatorTask.findAll({ where: { id_indrumator: indrumatorId } });

        let indrumatorToSend = await Promise.all(
            indrumatorTasks.map(async indrumatorTask => {
                let task = await Task.findOne({ where: { id: indrumatorTask.taskId } })
                return {
                    id: task.id,
                    name: task.name
                }
            })
        );
        res.send(indrumatorToSend)
    } catch (error) {
        res.send(error);
    }
}

exports.deleteIndrumatorTask = async (req, res, next) => {
    const indrumatorTaskId = req.params.taskId;

    try {
        const indrumatorTask = IndrumatorTask.findByPk(indrumatorTaskId);
        if (indrumatorTask) {
            await IndrumatorTask.destroy({ where: { id: indrumatorTaskId } });
        }
        res.send("deleted")
    } catch (error) {
        res.send(error);
    }
}
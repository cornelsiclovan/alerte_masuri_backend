const { Sequelize } = require("sequelize");
const Task = require("../models/task");

const op = Sequelize.Op;

exports.getTasks = async (req, res, next) => {
    let queryObject = {};
    let tasks;
    let typeId = req.query.typeId;

    console.log(typeId);

    try {
        tasks = await Task.findAll({where: {type_id: typeId}});

        res.send(tasks);
    } catch (error) {
        res.send(error);
    }
}

exports.getTasksByInfractiune = async (req, res, next) => {

}

exports.createTask = async (req, res, next) => {
    const nume = req.body.nume;
    const infractiune = req.body.infractiune; 

    try {
        let task = await Task.create({
            nume: nume,
            infractiune: infractiune
        })

        res.send(task)
    } catch(error) {
        res.send(error);    
    }
}

exports.editTask = async (req, res, next) => {
    const id_task = req.body.id_task;
    const nume = req.body.nume;
    const infractiune = req.body.infractiune;

    try {

        let task = await Task.findOne({where: {id: id_task}});


        if(nume) {
            task.nume = nume;
        }
        
        if(infractiune)
            task.infractiune = infractiune;

        await task.save();

        res.send(task);
    } catch(error) {
        res.send(error);
    }
}

exports.deleteTask = async (req, res, next) => {
    const id_task = req.body.id_task;

    try {
        let task = await Task.findOne({where: {id: id_task}});
         
        if(task) {
            await task.destroy();
        }

        res.send("success!")
        
    } catch(error) {
        res.send(error);
    }
}

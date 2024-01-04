const File = require("../models/file");
const fs = require("fs");
const path = require("path");

exports.getFileByDosarName = async (req, res, next) => {
  let fileNames;
  const dosar_numar =
    req.params.dosar_numar.split("-")[0] +
    "/" +
    req.params.dosar_numar.split("-")[1] +
    "/" +
    req.params.dosar_numar.split("-")[2];

  try {
    fileNames = await File.findAll({
      limit: 1,
      where: { numar_dosar: dosar_numar },
      order: [["createdAt", "DESC"]],
    });

    const tip_solutie = fileNames[0].tip_document;
    let directorsolutie = "/clasari-insusite/"

    if(tip_solutie.includes("RUP")) {
      directorsolutie = "/rup/"
    }

    if(tip_solutie.includes("RECH")) {
      directorsolutie = "/rechizitorii/"
    }
    
    if (!fileNames) {
      const error = new Error("Acest dosar nu are fisiere inregistrate");
      error.statusCode = 422;
      throw error;
    }

    const filePath = path.join(__dirname, "..", "..");

    const fileNameWithPath =
      filePath + "/documente" + directorsolutie + fileNames[0].nume + ".docx";

    fs.readFile(fileNameWithPath, (error, data) => {
      if (error) {
        throw error;
      }

      res.send(data);
    });

    //res.status(200).send({ message: "file sent" });
  } catch (err) {
    next(err);
  }
};

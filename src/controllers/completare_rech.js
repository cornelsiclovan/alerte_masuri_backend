const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const { TextRun, patchDocument, PatchType } = require("docx");
const { now } = require("mongoose");
const File = require("../models/file");

exports.genereaza = async (req, res, next) => {
  try {
    const nume_procuror = req.body.nume_procuror; // DIN ECRIS
    const numar_dosar = req.body.numar_dosar; // DIN ECRIS
    const autorul_faptei = req.body.autorul_faptei || "-----------------";
    const situatie = req.body.situatie || "------------------";
    let infractiune = req.body.fapta || "";

    let starea_de_fapt_data = situatie.split(",")[0].split(" ")[3];

    let starea_de_fapt_partial = "";
    let starea_de_fapt_reformulare =
      situatie.charAt(0).toLowerCase() + situatie.slice(1);

    if (
      starea_de_fapt_reformulare.charAt(
        starea_de_fapt_reformulare.length - 1
      ) === "."
    ) {
      starea_de_fapt_reformulare = starea_de_fapt_reformulare.slice(0, - 1);
    }

    let starea_de_fapt_reformulare_array = [];

    if (situatie.includes("inculpatul")) {
      starea_de_fapt_reformulare_array =
        starea_de_fapt_reformulare.split("inculpatul");
    }

    if (situatie.includes("numitul")) {
      starea_de_fapt_reformulare_array =
        starea_de_fapt_reformulare.split("numitul");
    }

    let starea_de_fapt_reformulare_array_2 =
      starea_de_fapt_reformulare.split("condus");

    let starea_de_fapt_partial_fara_nume =
      starea_de_fapt_reformulare_array[0] +
      " " +
      "a condus " +
      starea_de_fapt_reformulare_array_2[1];

    // rechizitoriu alcool sau lipsa permis
    if (infractiune.includes("335") || infractiune.includes("336")) {
      if (situatie.includes("alcoolemie")) {
        starea_de_fapt_partial = situatie.split("aflându-se")[0];
      }
      console.log("335");
      if (situatie.includes("fără")) {
        console.log("fara a detine");
        starea_de_fapt_partial = situatie.split("fără")[0];
      }
    }

    const nowDate = new Date();
    let dateOnly =
      nowDate.getDate() +
      "." +
      (nowDate.getMonth() + 1) +
      "." +
      nowDate.getFullYear();

    let dateArray = dateOnly.split(".");
    if (dateArray[0].length === 1) {
      dateArray[0] = "0" + dateArray[0];
    }

    if (dateArray[1].length === 1) {
      dateArray[1] = "0" + dateArray[1];
    }

    dateOnly = dateArray[0] + "." + dateArray[1] + "." + dateArray[2];

    const data_rech = dateOnly; // FORM

    const nume_procuror_all_caps = nume_procuror.toUpperCase(); // DIN ECRIS

    //fara permis
    let templateName = "template/rechi/template_335.docx";

    if (infractiune.includes("336")) {
      //alcool
      templateName = "template/rechi/template_336.docx";
    }

    patchDocument(fs.readFileSync(templateName), {
      patches: {
        numar_dosar: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${numar_dosar}`,
              bold: true,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        data_rech: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${data_rech}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        nume_procuror: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${nume_procuror}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        starea_de_fapt: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${situatie}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        data_stare_de_fapt: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${starea_de_fapt_data}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        starea_de_fapt_partial: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${starea_de_fapt_partial}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        starea_de_fapt_partial_fara_nume: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${starea_de_fapt_partial_fara_nume}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        starea_de_fapt_reformulare: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${starea_de_fapt_reformulare}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        autorul_faptei: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${autorul_faptei}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        autorul_faptei_italic: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${autorul_faptei}`,
              font: "Palatino Linotype",
              size: 24,
              italics: true,
            }),
          ],
        },
        nume_procuror_all_caps: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${nume_procuror_all_caps}`,
              font: "Palatino Linotype",
              size: 24,
              bold: true,
            }),
          ],
        },
      },
    }).then(async (doc) => {
      let filename = crypto.randomUUID();
      filename =
        numar_dosar.split("/")[0] +
        "-" +
        numar_dosar.split("/")[2] +
        " " +
        filename;

      fs.writeFileSync("documente/rechizitorii/" + filename + ".docx", doc);

      await File.create({
        numar_dosar: req.body.numar_dosar,
        nume: filename,
        tip_document: "RECH",
      });

      res.status(200).json({ message: "success" });
    });
  } catch (error) {
    next(error);
  }
};

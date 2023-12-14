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
    let pedeapsa = req.body.pedeapsa || "-----------------";

    const nowDate = new Date();
    const dateOnly =
      nowDate.getDate() +
      "." +
      (nowDate.getMonth() + 1) +
      "." +
      nowDate.getFullYear();

    const data_rup = dateOnly; // FORM

    let infractiune = req.body.fapta; // DIN ECRIS
    const parte_vatamata = req.body.parti_vatamate; // DIN ECRIS

    let comunicare_parti = "";


    if(parte_vatamata) {
      comunicare_parti = "persoanei vătămate " + parte_vatamata;
    }

    if (parte_vatamata && parte_vatamata.includes(",")) {
      comunicare_parti = "părților vătămate " + parte_vatamata;
    }

    console.log(typeof nume_procuror);

    const nume_procuror_all_caps = nume_procuror.toUpperCase(); // DIN ECRIS

    let templateName = "template/rup/template.docx";

    if (

      autorul_faptei === "AUTOR NECUNOSCUT" ||
      autorul_faptei === "AN" ||
      autorul_faptei === "A.N."
    ) {
      templateName = "template/rup_an/template.docx";
    }

    if (
      parte_vatamata && 
      autorul_faptei !== "AUTOR NECUNOSCUT" &&
      !autorul_faptei.includes(",")
    ) {
      comunicare_parti = comunicare_parti + " și numitului " + autorul_faptei;
    }

    
    if (
      !parte_vatamata && 
      autorul_faptei !== "AUTOR NECUNOSCUT" &&
      !autorul_faptei.includes(",")
    ) {
      comunicare_parti = comunicare_parti + "numitului " + autorul_faptei;
    }

    

    if (parte_vatamata && autorul_faptei !== "AUTOR NECUNOSCUT" && autorul_faptei.includes(",")) {
      comunicare_parti = comunicare_parti + " și numiților " + autorul_faptei;
    }

    if (!parte_vatamata && autorul_faptei !== "AUTOR NECUNOSCUT" && autorul_faptei.includes(",")) {
      comunicare_parti = comunicare_parti + "numiților " + autorul_faptei;
    }

    let fisa_cazier = "numitul " + autorul_faptei + " nu are";
    let audiat = "audiat, numitul " + autorul_faptei + " a";

    if(autorul_faptei.includes(",")) {
      fisa_cazier = "numiții " + autorul_faptei + " nu au"
      audiat = "audiați, numiții " + autorul_faptei + " au";
    }

    infractiune = infractiune.toLowerCase();
    infractiune = infractiune.replace("ncp", "C. pen.");

    pedeapsa = pedeapsa.toLowerCase();
    pedeapsa = pedeapsa.replace("ncp", "C. pen.");

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
        data_rup: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${data_rup}`,
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
        infractiune: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${infractiune}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        pedeapsa: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${pedeapsa}`,
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
        parte_vatamata: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${parte_vatamata}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        comunicare_parti: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${comunicare_parti}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        autorul_faptei: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${audiat}`,
              font: "Palatino Linotype",
              size: 24,
            }),
          ],
        },
        fisa_cazier: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${fisa_cazier}`,
              font: "Palatino Linotype",
              size: 24,
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

      fs.writeFileSync("documente/rup/" + filename + ".docx", doc);

      await File.create({
        numar_dosar: req.body.numar_dosar,
        nume: filename,
        tip_document: "RUP",
      });

      res.status(200).json({ message: "success" });
    });
  } catch (error) {
    next(error);
  }
};

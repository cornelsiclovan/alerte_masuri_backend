const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const { TextRun, patchDocument, PatchType } = require("docx");
const { now } = require("mongoose");
const File = require("../models/file");

const LITERE_ARTICOL_CU_TEXT_LIBRARY = [
  "lit. a C. proc. pen., întrucât fapta nu exista",
  "lit. b teza I C. proc. pen., întrucât fapta nu este prevăzută de legea penală",
  "lit. b teza II C. proc. pen., întrucât fapta nu a fost săvârșită cu vinovăția prevăzută de lege",
  "lit. c C. proc. pen., întrucât nu există probe că o persoană a săvârșit infracțiunea",
  "lit. d C. proc. pen., întrucât este incidentă o cauză justificativă",
  "lit. d C. proc. pen., întrucât este incidentă o cauză de neimputabilitate",
  "lit. e C. proc. pen., întrucât lipsește plângerea prealabilă",
  "lit. f C. proc. pen., întrucât a intervenit decesul",
  "lit. f C. proc. pen., întrucât a intervenit prescripția răspunderii penale",
  "lit. g teza I C. proc. pen., întrucât a intervenit retragerea plângerii prealabile",
  "lit. g teza II C. proc. pen., întrucât a intervenit împăcarea părților",
  "lit. h C. proc. pen., întrucât există o cauză de nepedepsire",
  "lit. i C. proc. pen., întrucât există autoritate de lucru judecat",
];

let LITERE_ARTICOL_LIBRARY = [];

LITERE_ARTICOL_CU_TEXT_LIBRARY.forEach((litera_articol) => {
  LITERE_ARTICOL_LIBRARY.push(litera_articol.split(",")[0].slice(0, -1));
});

exports.genereaza = async (req, res, next) => {
  try {
    const nume_procuror = req.body.nume_procuror; // DIN ECRIS
    const numar_dosar = req.body.numar_dosar; // DIN ECRIS

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

    const data_clasare = dateOnly; // FORM

    let data_formatata =
      req.body.data_solutie_propusa.split(" ")[0].split("-")[2] +
      "." +
      req.body.data_solutie_propusa.split(" ")[0].split("-")[1] +
      "." +
      req.body.data_solutie_propusa.split(" ")[0].split("-")[0];

    const data_referat = data_formatata; // DIN ECRIS

    const litera_articol_cu_text_propusa =
      LITERE_ARTICOL_CU_TEXT_LIBRARY[req.body.litera_articol_id]; // FORM SELECT DIN LIBRARY CU SEARCH AUTOCOMPLETE MULTISELECT
    const litera_articol_cu_text_finala =
      LITERE_ARTICOL_CU_TEXT_LIBRARY[req.body.litera_articol_id]; // FORM SELECT DIN LIBRARY CU SEARCH AUTOCOMPLETE MULTISELECT

    const litera_articol_fara_text =
      LITERE_ARTICOL_LIBRARY[req.body.litera_articol_id]; // FORM SELECT DIN LIBRARY CU SEARCH AUTOCOMPLETE MULTISELECT
    const infractiune = req.body.fapta; // DIN ECRIS
    let parte_vatamata = req.body.parti_vatamate; // DIN ECRIS

    console.log(parte_vatamata)

    if(!parte_vatamata) {
      parte_vatamata = "";
    }

    const nume_procuror_all_caps = nume_procuror.toUpperCase(); // DIN ECRIS

    let textParteVatamata = "persoanei vătămate " + parte_vatamata;

    let textParteVatamata_chelt = "persoana vătămată " + parte_vatamata;

    if (parte_vatamata && parte_vatamata.includes(", ")) {
      textParteVatamata = "persoanelor vătămate " + parte_vatamata;
      textParteVatamata_chelt = "pesoanele vătămate " + parte_vatamata;
    }

    let alin_3 =
      "În temeiul art. 275 alin. (5) rap. la art. 275 alin. (3) C.proc. pen. cheltuielile judiciare efectuate rămân în sarcina statului.";

    if (
      req.body.litera_articol_id === "9"
    ) {
      alin_3 =
        "În  temeiul  art. 275  alin. (5) rap.  la art.  275 alin. (1) pct. 2 lit. b) C. proc. pen., cheltuielile judiciare în cuantum de 50 de lei urmează a fi suportate de persoana vătămată.";
    }



    if(req.body.litera_articol_id === "10") {
      alin_3 = "În  temeiul  art. 275  alin. (5) rap.  la art.  275 alin. (1) pct. 2 lit. d C. proc. pen., cheltuielile judiciare în cuantum de 50 de lei vor fi suportate de către " + textParteVatamata_chelt  + " – 25 lei și numitul " + req.body.autorul_faptei + " - 25 lei.";
    }

    if (req.body.autorul_faptei && !req.body.autorul_faptei.includes("NECUNOSCUT")) {
      if (
        req.body.autorul_faptei !== null &&
        !req.body.autorul_faptei.includes(",")
      ) {
        textParteVatamata += " și numitului " + req.body.autorul_faptei;
      } else if (
        req.body.autorul_faptei !== null &&
        req.body.autorul_faptei.includes(",")
      ) {
        textParteVatamata += " și numiților " + req.body.autorul_faptei;
      }
    }

    patchDocument(fs.readFileSync("template/clasare-insusita/template.docx"), {
      patches: {
        numar_dosar: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${numar_dosar}`,
              bold: true,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        data_clasare: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${data_clasare}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        nume_procuror: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${nume_procuror}`,
              font: "Times New Roman",
              bold: true,
              size: 24,
            }),
          ],
        },
        data_referat: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${data_referat}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        litera_articol_cu_text_propusa: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${litera_articol_cu_text_propusa}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        litera_articol_cu_text_finala: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${litera_articol_cu_text_finala}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        litera_articol_fara_text: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${litera_articol_fara_text}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        infractiune: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${infractiune}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        parte_vatamata: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${textParteVatamata}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        alin_3: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${alin_3}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        nume_procuror_all_caps: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${nume_procuror_all_caps}`,
              font: "Times New Roman",
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

      const docPath = path.join(
        __dirname,
        "..",
        "..",
        "documente",
        "clasari-insusite"
      );

      fs.writeFileSync("documente/clasari-insusite/" + filename + ".docx", doc);

      await File.create({
        numar_dosar: req.body.numar_dosar,
        nume: filename,
        tip_document: "CLASARE INSUSITA",
        procuror: req.body.nume_procuror
      });

      // const myDocName = docPath + "/" + filename + ".docx";

      res.status(200).json({ message: "success" });

      // res.status(200).json({
      //   message: "dosarul a fost solutionat",
      // });
    });
  } catch (error) {
    next(error);
  }
};

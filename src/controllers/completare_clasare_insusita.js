const fs = require("fs");
const crypto = require("crypto");

const { TextRun, patchDocument, PatchType } = require("docx");

const LITERE_ARTICOL_CU_TEXT_LIBRARY = [
  "lit. a C. proc. pen., întrucât fapta nu exista",
  "lit. b teza I C. proc. pen., întrucât fapta nu este prevăzută de legea penală",
  "lit. b teza II C. proc. pen., întrucât fapta nu a fost săvârșită cu vinovăția prevăzută de lege",
  "lit. c C. proc. pen., întrucât nu există probe că o persoană a săvârșit infracțiunea",
  "lit. d C. proc. pen., întrucât este incidentă o cauză justificativă",
  "lit. d C. proc. pen., întrucât este incidentă o cauză de neimputabilitate",
  "lit. e, C. proc. pen., întrucât lipsește plângerea prealabilă",
  "lit. f C. proc. pen., întrucât a intervenit decesul",
  "lit. f C. proc. pen., întrucât a intervenit prescripția răspunderii penale",
  "lit. g teza I C. proc. pen., întrucât a intervenit retragerea plângerii prealabile",
  "lit. g teza II C. proc. pen., întrucât a intervenit împăcarea părților",
  "lit. h C. proc. pen., întrucât există o cauză de nepedepsire",
  "lit. i C. proc. pen., întrucât există autoritate de lucru judecat",
];

let LITERE_ARTICOL_LIBRARY = [];

LITERE_ARTICOL_CU_TEXT_LIBRARY.forEach((litera_articol) => {
  LITERE_ARTICOL_LIBRARY.push(
    litera_articol.split(",")[0] + ", " + litera_articol.split(",")[1]
  );
});

exports.genereaza = () => {
  const nume_procuror = "Bonda Alexandru Vasile"; // DIN ECRIS
  const numar_dosar = "6750/P/2022"; // DIN ECRIS
  const data_clasare = "28.04.2023"; // FORM
  const data_referat = "31.01.2023"; // DIN ECRIS
  const litera_articol_cu_text_propusa = LITERE_ARTICOL_CU_TEXT_LIBRARY[0]; // FORM SELECT DIN LIBRARY CU SEARCH AUTOCOMPLETE MULTISELECT
  const litera_articol_cu_text_finala = LITERE_ARTICOL_CU_TEXT_LIBRARY[0]; // FORM SELECT DIN LIBRARY CU SEARCH AUTOCOMPLETE MULTISELECT
  const litera_articol_fara_text = LITERE_ARTICOL_LIBRARY[0]; // FORM SELECT DIN LIBRARY CU SEARCH AUTOCOMPLETE MULTISELECT
  const infractiune = "furt, prev. de art. 228 alin. (1) C. pen."; // DIN ECRIS
  const parte_vatamata = "Dobra Dorina Ana"; // DIN ECRIS

  const nume_procuror_all_caps = nume_procuror.toUpperCase(); // DIN ECRIS

  patchDocument(fs.readFileSync("template/clasare-insusita/template.docx"), {
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
      data_clasare: {
        type: PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text: `${data_clasare}`,
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
      data_referat: {
        type: PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text: `${data_referat}`,
            font: "Palatino Linotype",
            size: 24,
          }),
        ],
      },
      litera_articol_cu_text_propusa: {
        type: PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text: `${litera_articol_cu_text_propusa}`,
            font: "Palatino Linotype",
            size: 24,
          }),
        ],
      },
      litera_articol_cu_text_finala: {
        type: PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text: `${litera_articol_cu_text_finala}`,
            font: "Palatino Linotype",
            size: 24,
          }),
        ],
      },
      litera_articol_fara_text: {
        type: PatchType.PARAGRAPH,
        children: [
          new TextRun({
            text: `${litera_articol_fara_text}`,
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
  }).then((doc) => {
    let filename = crypto.randomUUID();
    filename =
      numar_dosar.split("/")[0] +
      "-" +
      numar_dosar.split("/")[2] +
      " " +
      filename;

    fs.writeFileSync("documente/clasari-insusite/" + filename + ".docx", doc);
  });
};

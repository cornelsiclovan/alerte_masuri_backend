const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const { TextRun, patchDocument, PatchType, Spacing } = require("docx");
const { now } = require("mongoose");
const File = require("../models/file");
const Part = require("../models/part");

exports.genereaza = async (req, res, next) => {
  try {
    const nume_procuror = req.body.nume_procuror; // DIN ECRIS
    const numar_dosar = req.body.numar_dosar; // DIN ECRIS
    let autorul_faptei = req.body.autorul_faptei || "-----------------";
    const situatie = req.body.situatie || "------------------";
    let infractiune = req.body.fapta || "";

  

    if(autorul_faptei && autorul_faptei.includes(",")) {
      autorul_faptei = autorul_faptei.split(",")[0];
    }

    let autor = await Part.findOne({
      where: { nume: autorul_faptei, numar_dosar: numar_dosar },
    });

    let autor_minor_major = "major";

    let autor_data_nastere;

    let cnp = "";
    let tata = "";
    let mama = "";
    let locul_nasterii = "";
    let judet_nastere = "";
    let localitate = "";
    let judet = "";
    let strada = "";
    let numar = "";
    let bloc = "";
    let scara = "";
    let apartament = "";
    let stare_civila = "";
    let studii = "";
    let ocupatie = "";



    if (autor) {
    
      if (autor.minor && autor.minor === "1") {
        autor_minor_major = "minor";
      }


      if (autor.data_nasterii)
        autor_data_nastere = autor.data_nasterii.split(" ")[0];

      if (autor.cnp) {
        cnp = autor.cnp;
      }

      if(autor.tata) {
        tata = autor.tata;
      }

      if(autor.mama) {
        tata = autor.mama;
      }

      if(autor.locul_nasterii) {
        locul_nasterii = autor.locul_nasterii;
      }

      if(autor.judet_nastere) {
        judet_nastere = autor.judet_nastere;
      }

      if(autor.localitate) {
        localitate = autor.localitate;
      }

      if(autor.localitate === "" && autor.sector !== "") {
        localitate = autor.sector;
      }

      if(autor.judet) {
        judet = autor.judet;
      }
     
      if(autor.strada) {
        strada = autor.strada;
      }

      
      if(autor.numar) {
        numar = autor.numar;
      }
     
      if(autor.bloc) {
        bloc = autor.bloc;
      }

      if(autor.scara) {
        scara = autor.scara;
      }
      
      if(autor.apartament) {
        apartament = autor.apartament;
      }
      
      if(autor.stare_civila) {
        stare_civila = autor.stare_civila;
      }
     
      if(autor.studii) {
        studii = autor.studii.toLowerCase();
      }

      if(studii.includes("studii")){
        studii = studii.split(" ")[1];
      }
      
      if(autor.ocupatie) {
        ocupatie = autor.ocupatie.toLowerCase();
      }
      
    }

    let starea_de_fapt_data = situatie.split(",")[0].split(" ")[3];

    let starea_de_fapt_partial = "";
    let starea_de_fapt_reformulare =
      situatie.charAt(0).toLowerCase() + situatie.slice(1);

    let starea_de_fapt_lower_case =
      situatie.charAt(0).toLowerCase() + situatie.slice(1);

    if (
      starea_de_fapt_reformulare.charAt(
        starea_de_fapt_reformulare.length - 1
      ) === "."
    ) {
      starea_de_fapt_reformulare = starea_de_fapt_reformulare.slice(0, -1);
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
      if (situatie.includes("alcool") || situatie.includes("droguri")) {
        if (situatie.includes("aflându-se"))
          starea_de_fapt_partial = situatie.split("aflându-se")[0];
        if (situatie.includes("fiind"))
          starea_de_fapt_partial = situatie.split("fiind")[0];
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

    if (infractiune.includes("336") && infractiune.includes("2")) {
      //droguri
      templateName = "template/rechi/template_droguri.docx";
    }

    if (infractiune.includes("335") && infractiune.includes("2")) {
      //permis suspendat sau anulat
      templateName = "template/rechi/template_permis_suspendat_sau_anulat.docx";
    }

    patchDocument(fs.readFileSync(templateName), {
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
        data_rech: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${data_rech}`,
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
        starea_de_fapt: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${situatie}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        starea_de_fapt_lower_case: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${starea_de_fapt_lower_case}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        data_stare_de_fapt: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${starea_de_fapt_data}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        starea_de_fapt_partial: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${starea_de_fapt_partial}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        starea_de_fapt_partial_fara_nume: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${starea_de_fapt_partial_fara_nume}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        starea_de_fapt_reformulare: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${starea_de_fapt_reformulare}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        autorul_faptei: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${autorul_faptei}`,
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        cnp: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${cnp}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        tata: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${tata}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        mama: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${mama}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        data_nastere: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${autor_data_nastere}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        loc_nastere: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${locul_nasterii}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        judet_nastere: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${judet_nastere}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        localitate: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${localitate}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        judet: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${judet}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        strada: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${strada}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        numar: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${numar}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        bloc: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${bloc}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        scara: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${scara}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        apartament: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${apartament}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        minor_major: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${autor_minor_major}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        stare_civila: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${stare_civila}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        studii: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${studii}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        ocupatie: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${ocupatie}` || "--------",
              font: "Times New Roman",
              size: 24,
            }),
          ],
        },
        autorul_faptei_italic: {
          type: PatchType.PARAGRAPH,
          children: [
            new TextRun({
              text: `${autorul_faptei}`,
              font: "Times New Roman",
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

      fs.writeFileSync("documente/rechizitorii/" + filename + ".docx", doc);

      await File.create({
        numar_dosar: req.body.numar_dosar,
        nume: filename,
        tip_document: "RECH",
        procuror: req.body.nume_procuror
      });

      res.status(200).json({ message: "success" });
    });
  } catch (error) {
    next(error);
  }
};

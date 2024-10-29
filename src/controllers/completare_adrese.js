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
        let infractiune = req.body.infractiune || "";
        let tip_adresa = req.body.tip_adresa;
        let parte_vatamata = req.body.parte_vatamata;

        console.log("TESt");

        if (autorul_faptei && autorul_faptei.includes(",")) {
            autorul_faptei = autorul_faptei.split(",")[0];
        }

        let autor = await Part.findOne({
            where: { nume: autorul_faptei, numar_dosar: numar_dosar },
        });




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

        const data_adresa = dateOnly; // FORM

        const nume_procuror_all_caps = nume_procuror.toUpperCase(); // DIN ECRIS

        let templateName = "template/adrese/" + tip_adresa + ".docx";

        console.log(templateName);
        

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
                data: {
                    type: PatchType.PARAGRAPH,
                    children: [
                        new TextRun({
                            text: `${data_adresa}`,
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
                parte_vatamata: {
                    type: PatchType.PARAGRAPH,
                    children: [
                        new TextRun({
                            text: `${parte_vatamata}`,
                            font: "Times New Roman",
                            size: 24,
                        }),
                    ],
                },
                articol_infractiune: {
                    type: PatchType.PARAGRAPH,
                    children: [
                        new TextRun({
                            text: `${infractiune}`,
                            font: "Times New Roman",
                            size: 24,
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

            fs.writeFileSync("documente/adrese/" + filename + ".docx", doc);

            await File.create({
                numar_dosar: req.body.numar_dosar,
                nume: filename,
                tip_document: "ADRESA",
                procuror: req.body.nume_procuror
            });

            res.status(200).json({ message: "success" });
        });
    } catch (error) {
        next(error);
    }
};

const fs = require("fs");
const crypto = require("crypto");
const { TextRun, patchDocument, PatchType, Spacing, Level, Bullet } = require("docx");
const File = require("../models/file");

exports.genereaza = async (req, res, next) => {

    try {
        const nume_procuror = req.body.nume_procuror; // DIN ECRIS
        const numar_dosar = req.body.numar_dosar; // DIN ECRIS
        const termen = req.body.termen;
        const notaDeIndrumare = req.body.notaDeIndrumare;

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

        const data_indrumare = dateOnly; // FORM

        const nume_procuror_all_caps = nume_procuror.toUpperCase(); // DIN ECRIS

        let templateName = "template/note_indrumare/template.docx";


        let taskTypesOthers = [];
        let taskTypes = ["Audiere", "Referat"];
        let tasksAudiere = [];
        let tasksReferat = [];
        if (notaDeIndrumare && notaDeIndrumare.tasks) {
            notaDeIndrumare.tasks.map(task => {
                if (task.task_type === taskTypes[0]) {
                    tasksAudiere.push(task);
                } else if (task.task_type === taskTypes[1]) {
                    tasksReferat.push(task)
                } else {
                    taskTypesOthers.push(task);
                }
            })
        }

        let taskChildren = []

        if (tasksAudiere.length > 0) {
            taskChildren.push(new TextRun({
                text: `● Audiere `,
                bold: true,
                font: "Times New Roman",
                size: 24,
            }));
            taskChildren.push(new TextRun({
                break: 1
            }))
        }

        tasksAudiere.map(task => {

            taskChildren.push(new TextRun({
                text: `                      ○ ${task.task_name} ${task.nota}`,
                bold: false,
                font: "Times New Roman",
                size: 24,
            }),
            )
            taskChildren.push(new TextRun({
                break: 1
            }))
        })


        if (tasksAudiere.length > 0) {
            if (tasksReferat.length > 0) {
                taskChildren.push(new TextRun({
                    text: `            ● Referat `,
                    bold: true,
                    font: "Times New Roman",
                    size: 24,
                }));
                taskChildren.push(new TextRun({
                    break: 1
                }))
            }
        }

        if (tasksAudiere.length === 0) {
            if (tasksReferat.length > 0) {
                taskChildren.push(new TextRun({
                    text: `● Referat `,
                    bold: true,
                    font: "Times New Roman",
                    size: 24,
                }));
                taskChildren.push(new TextRun({
                    break: 1
                }))
            }
        }

        tasksReferat.map(task => {
            taskChildren.push(new TextRun({
                text: `                      ○ ${task.task_name} ${task.nota}`,
                bold: false,
                font: "Times New Roman",
                size: 24,
            }),
            )
            taskChildren.push(new TextRun({
                break: 1
            }))
        });

        taskTypesOthers.map(task => {
            console.log(task)
            taskChildren.push(new TextRun({
                text: `            ● ${task.task_name} ${task.nota}`,
                bold: true,
                font: "Times New Roman",
                size: 24,
            }));
            taskChildren.push(new TextRun({
                break: 1
            }))
        })


        patchDocument(fs.readFileSync(templateName), {
            patches: {
                activitati: {
                    type: PatchType.PARAGRAPH,
                    children: taskChildren
                },
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
                data_indrumare: {
                    type: PatchType.PARAGRAPH,
                    children: [
                        new TextRun({
                            text: `${data_indrumare}`,
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
                nume_procuror_all_caps: {
                    type: PatchType.PARAGRAPH,
                    children: [
                        new TextRun({
                            text: `${nume_procuror_all_caps}`,
                            font: "Times New Roman",
                            bold: true,
                            size: 24,
                        }),
                    ],
                },
                termen: {
                    type: PatchType.PARAGRAPH,
                    children: [
                        new TextRun({
                            text: `${termen}`,
                            font: "Times New Roman",
                            bold: true,
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

            fs.writeFileSync("documente/indrumari/" + filename + ".docx", doc);

            await File.create({
                numar_dosar: req.body.numar_dosar,
                nume: filename,
                tip_document: "Nota indrumare",
                procuror: req.body.nume_procuror
            });

            res.status(200).json({ message: "success" });
        });
    } catch (error) {
        next(error);
    }
};

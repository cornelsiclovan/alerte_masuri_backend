const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./src/util/database");
const path = require("path");

const Dosar = require("./src/models/dosar");
const User = require("./src/models/user");
const Doing = require("./src/models/fapte");
const Part = require("./src/models/part");
const File = require("./src/models/file");
const Pedepse = require("./src/models/pedepse");
const Stoc = require("./src/models/stoc");
const Incarcatura = require("./src/models/incarcatura");
const Upp = require("./src/models/upp");

const partsAc = require("./src/models/partAc");
const doingAc = require("./src/models/fapteAc");

const authRoutes = require("./src/routes/auth");
const dosRoutes = require("./src/routes/dosare");
const userRoutes = require("./src/routes/user");
const infractiuniRoutes = require("./src/routes/infractiuni");
const pedepseRoutes = require("./src/routes/pedepse");
const dateDosareSolutionateRoutes = require("./src/routes/dosare_solutionate");
const solutionateLunarRoutes = require("./src/routes/solutionate_lunar");
const genereazaDocumenteRoutes = require("./src/routes/genereaza_documente");
const doingRoutes = require("./src/routes/doing");
const partRoutes = require("./src/routes/part");
const fileRoutes = require("./src/routes/file");
const Infractiuni = require("./src/models/infractiuni");
const participariRoutes = require("./src/routes/participari");
const Participare = require("./src/models/participari_sedinte");
const ordineRoutes = require("./src/routes/ordine");
const Ordine = require("./src/models/ordin");




dotenv.config();
const app = express();

app.use(bodyParser.json());

app.use(
  "/uploads/documents",
  express.static(path.join("uploads", "documents"))
);


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Content-disposition, X-Requested-With, Content-Type, Accept, Authorization"
  );

  next();
});

//Routing

app.use("/dosar", dosRoutes);
app.use("/user", userRoutes);
app.use("/infractiuni", infractiuniRoutes);
app.use("/pedepse", pedepseRoutes);
app.use("/dateDosareSolutionate", dateDosareSolutionateRoutes);
app.use("/solutionateLunar", solutionateLunarRoutes);
app.use("/doings", doingRoutes);
app.use("/parts", partRoutes);
app.use("/file", fileRoutes);
app.use("/participari", participariRoutes);
app.use("/ordine", ordineRoutes);

app.use("/genereaza-documente", genereazaDocumenteRoutes);

app.use(authRoutes);

//End Routing

//error handling

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});

//end error handling

// Relations

Dosar.belongsTo(User, { constraints: true, onDelete: "RESTRICT" });
User.hasMany(Dosar);

// Pedepse.belongsTo(Infractiuni, { constraints: true, onDelete: "RESTRICT" });
// Infractiuni.hasMany(Pedepse);

// End Relations

try {
  //sequelize.sync({force: true});
  sequelize.sync();
} catch (error) {
  console.log(error);
}

app.listen(8080);

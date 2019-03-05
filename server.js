const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const router = express.Router();

// Body parser middleware

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

require("./routes/index.js")(router, app);

// Connect to MongoDB
mongoose
  .connect(
    db,
    {useNewUrlParser: true, useCreateIndex: true}
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.log("Problem in connecting Mongo DB Server.");
    process.exit();
  });

process
  .on("unhandledRejection", (reason, p) => {
    console.log(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", err => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

const port = process.env.PORT || 8686;

var serverObj = app.listen(port);
serverObj.timeout = 9000;
console.log(`Server running on port ${port}`);

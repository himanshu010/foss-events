const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const { promisify } = require("util");

dotenv.config({ path: "./config/dev.env" });

const app = express();
const port = process.env.PORT || 3000;

//defining paths for handlebars
const publicDirectoryPath = path.join(__dirname, "../Frontend");
const viewPath = path.join(__dirname, "../templates/views");

//setup handlebars
app.set("view engine", "hbs");
app.set("views", viewPath);

//seting up static npfiles. So that
//we don't have to give location
//of whole file present in public folder
app.use(express.static(publicDirectoryPath));
app.use(express.urlencoded());
app.use(express.json());

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/addevent", async (req, res) => {
  res.render("addEvent");
});

app.post("/registerevent", async (req, res) => {
  let website = req.body.website.split("/");
  req.body.website = "";
  for (let i = 2; i < website.length; i++) {
    req.body.website += website[i] + "/";
  }
  const readFile = promisify(fs.readFile);
  const writeFile = promisify(fs.writeFile);

  function getStuff() {
    return readFile("./Frontend/data/events.json");
  }
  const writeData = async (data) => {
    data.unshift(req.body);
    data = JSON.stringify(data);
    await writeFile("./Frontend/data/events.json", data);
  };

  getStuff().then((data) => {
    data = JSON.parse(data);
    writeData(data).then(() => {
      console.log("done");
    });
  });

  res.render("registered", req.body);
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(port, () => {
  console.log("server is up on port " + port);
});

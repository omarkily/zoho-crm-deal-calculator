/*
  Local Zoho Extension Toolkit (ZET) style static server.
  Uses HTTPS when key.pem/cert.pem exist; otherwise falls back to HTTP for easy portfolio demos.
*/
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var errorHandler = require("errorhandler");
var morgan = require("morgan");
var serveIndex = require("serve-index");
var http = require("http");
var https = require("https");
var chalk = require("chalk");

process.env.PWD = process.env.PWD || process.cwd();

var expressApp = express();
var port = process.env.PORT || 5000;

expressApp.set("port", port);
expressApp.use(morgan("dev"));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(errorHandler());

expressApp.use("/", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

expressApp.get("/plugin-manifest.json", function (req, res) {
  res.sendFile(path.join(process.env.PWD, "plugin-manifest.json"));
});

expressApp.use("/app", express.static("app"));
expressApp.use("/app", serveIndex("app"));

expressApp.get("/", function (req, res) {
  res.redirect("/app");
});

var keyPath = path.join(process.env.PWD, "key.pem");
var certPath = path.join(process.env.PWD, "cert.pem");
var useHttps = fs.existsSync(keyPath) && fs.existsSync(certPath);

function onListen() {
  var proto = useHttps ? "https" : "http";
  console.log(chalk.green("Widget server running at " + proto + "://127.0.0.1:" + port));
  if (useHttps) {
    console.log(
      chalk.bold.cyan(
        "Note: authorize https://127.0.0.1:" +
          port +
          " in the browser (Advanced → Proceed) for Zoho ZET local testing.",
      ),
    );
  } else {
    console.log(
      chalk.yellow(
        "No key.pem/cert.pem found — serving over HTTP. Generate certs for Zoho ZET HTTPS testing.",
      ),
    );
  }
}

var server = useHttps
  ? https.createServer(
      { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
      expressApp,
    )
  : http.createServer(expressApp);

server.listen(port, onListen).on("error", function (err) {
  if (err.code === "EADDRINUSE") {
    console.log(chalk.bold.red(port + " port is already in use"));
  } else {
    throw err;
  }
});

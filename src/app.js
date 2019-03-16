const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient; //allow us to establish a connection
const ObjectId = require("mongodb").ObjectID; //allow us to work with document ids

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

// the API should listen locally the port 9292
app.listen(9292, () => {});

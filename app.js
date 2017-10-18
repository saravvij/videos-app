const express = require("express");
const engines = require('consolidate');
const bodyParser = require('body-parser')
const app = new express();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.engine("html", engines.nunjucks);
app.set("view engine", "html");
app.set("views", __dirname + "/views");
 
MongoClient.connect("mongodb://localhost:27017/video", (err, db) => {
    assert.equal(null, err);
    console.log("Successfully connected to MongoDB");

    app.post("/movies", (req, resp) => {
        db.collection("movies").insertOne(
            {
                "title": req.body.title,
                "year": req.body.year,
                "imdb": req.body.imdb
            });
        resp.send("Movie added.")
    });

    app.get("/", (req, resp) => {
        //resp.send("Hello, welcome to express");
        resp.render("hello", { "message": "welcome to exp" });
    });

    app.get("/addmovie", (req, resp) => {
        resp.render("movie-form");
    });

    app.use((req, resp, next) => {
        resp.send("Error: No routes found.");
    });

    app.use((err, req, resp, next) => {
        console.log(err.message);
        console.log(err.stack);
        resp.status(500);
        // res.render("error_template", {error:err});
    });

    app.listen(3000, function () {
        console.log("Server listening at port 3000");
    })

});



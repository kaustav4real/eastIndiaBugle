require('dotenv').config();
const _ = require('lodash');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/articlesDB");

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: true },
    coverImage: { type: String, required: true }
});

const Articles = mongoose.model("Article", articleSchema);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set("view engine", "ejs");

app.get("/", (req, res) => {

    Articles.find({}, (err, foundArticles) => {
        if (!err) {
            res.render("home", { posts: foundArticles });
            foundArticles.map(p => {
                console.log(p.id);
            })
        }
        else {
            res.send(err);
        }
    });
});

app.get("/articles/:article", (req, res) => {
    const articleID = req.params.article;

    Articles.findById(articleID, (err, foundArticle) => {
        if (foundArticle) {
            res.render("article", { article: foundArticle });
        } else {
            res.send("Error.No article was found");
        }
    });
});

app.get("/news/article/:news_type", (req, res) => {
    const newsType = req.params.news_type.toLowerCase();

    Articles.find({ tag: newsType }, (err, foundArticles) => {
        if (!err) {
            res.render("news_type", { posts: foundArticles });
            foundArticles.map(p => {
                console.log(p.id);
            })
        }
        else {
            res.send(err);
        }
    });
});

app.get("/" + process.env.SECRET, (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    const article = new Articles({
        title: req.body.title,
        content: req.body.content,
        tag: req.body.tag,
        coverImage: req.body.coverImage
    });
    article.save(err => {
        if (!err) {
            res.redirect("/");
        } else {
            res.send(err);
        }
    });

});

app.delete("/admin", (req, res) => {
    res.render()
});

app.listen("3000", () => { console.log("Server running at PORT 3000."); });
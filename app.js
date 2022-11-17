//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//mongoose.connect("mongodb://localhost:27017/blogDB");
mongoose.connect("mongodb://0.0.0.0:27017/blogDB");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

/* Another way for Creating a schema
const postSchema = {
title: String,
content: String
};
*/

const Post = mongoose.model("Post", postSchema);

const homeStartingContent =
  "What qualifies as an Internship/WIL? A postion in a registered company or an organization that trains a student in their relevant field of study, around the ICT faculty in this case. The position should be for a minimum of 6months, and for that period a student will be assigned a coordinator. ps: Student will be informed who their coordinator is upon registration. The students are adviced to regularly check this site to be able to see when their respective Department Head posts about their availability in their offices and on their emails, so to help students with registering their internship module, as well as to answer to their queries.";
const contactContent = "Email: mrranko@tut.ac.za";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  //posts.push(post);
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
  //res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

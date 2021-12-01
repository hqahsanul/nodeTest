const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
//const path = require("path");

const saltRounds = 8;

const app = express();

app.use(
  session({
    secret: "node js",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/testDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dob: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  if (req.session.email) {
    User.findOne({ email: req.session.email }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render("data", {
          name: data.name,
          email: data.email,
          dob: data.dob,
        });
      }
    });
  } else {
    res.render("home");
  }
});

app.get("/login", function (req, res) {
  if (req.session.email) {
    User.findOne({ email: req.session.email }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render("data", {
          name: data.name,
          email: data.email,
          dob: data.dob,
        });
      }
    });
  } else {
    res.render( "login");
  }
});

//app.get("/test", function (req, res) {
//User.findOne({ email: req.session.email }, function (err, data) {
//  if (err) {
//   console.log(err);
//} else {
//  console.log(data.name);
// res.render("test", { name: data.name });
//  }
// });
//});

app.get("/register", function (req, res) {
  if (req.session.email) {
    User.findOne({ email: req.session.email }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render("data", {
          name: data.name,
          email: data.email,
          dob: data.dob,
        });
      }
    });
  } else {
    res.render("register");
  }
});

//app.get("/data", function (req, res) {
//res.render("data");
//});

app.get("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("logout");
        res.redirect("/");
      }
    });
  }
});

app.post("/login", function (req, res) {
  const username = req.body.email;
  const password = req.body.password;
  User.findOne({ email: username }, function (err, data) {
    if (data) {
      bcrypt.compare(password, data.password, function (err, result) {
        if (result === true) {
          req.session.email = data.email;
          //console.log(req.session.email);
          res.render("data", {
            name: data.name,
            email: data.email,
            dob: data.dob,
          });
        }
      });
    } else {
      res.render("home");
    }
  });
});

app.post("/register", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, data) {
    if (data) {
      res.render("home");
    } else {
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
          console.log(err);
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            dob: req.body.dob,
          });

          if (req.body.password === req.body.conpassword) {
            newUser.save(function (err) {
              if (err) {
                console.log(err);
              } else {
                User.findOne({ email: req.body.email }, function (err, data) {
                  req.session.email = data.email;
                  res.render("data", {
                    name: data.name,
                    email: data.email,
                    dob: data.dob,
                  });
                });
              }
            });
          }
        }
      });
    }
  });
});

app.listen(5000, function () {
  console.log("Server has started at port 5000");
});

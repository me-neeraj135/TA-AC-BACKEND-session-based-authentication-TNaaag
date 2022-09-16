/** @format */

let express = require(`express`);
let http = require(`http`);
let url = require(`url`);

let logger = require(`morgan`);

const cookieParser = require("cookie-parser");

let app = express();

// set middleware
app.use(logger(`dev`));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + `public`));

//
app.get(`/admin`, (req, res, next) => {
  next(`unauthorized access`);
});

app.use(`/index`, (req, res, next) => {
  var name = req.cookies.name;

  if (name) {
    res.cookie(`name`, `Neeraj`);
  } else {
    res.cookie(`name`, `Neeraj`);
  }
  res.send(`welcome to authentication`);
});

// error 404

app.use((req, res, next) => {
  res.send(`page not found`);
});
// custom error

app.use((err, req, res, next) => {
  res.status(500).send(err);
});

app.listen(3000, () => {
  console.log(`server listening on port 3k`);
});

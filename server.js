const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const app = express();
require("dotenv").config();

const database = module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    // useCreateIndex: true,
  }
  try {
    mongoose.connect(process.env.DATABASE, connectionParams)
    console.log('Connected to database ')
  } catch (error) {
    console.log('Could not connect to database: ', error)
  }
}

database();

// mongoose.connect("mongodb://localhost/urlShortener", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("Connected to MongoDB");
// }).catch((error) => {
//   console.log(error);
// });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await  ShortUrl.find();
  res.render("index", {shortUrls : shortUrls});
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.status(404).json({ error: "Url not found" });
  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000, () => {
  if (process.env.PORT){
    console.log(`Server is running on http://localhost:${process.env.PORT}/`);
  }
  else{
    console.log(`Server is running on http://localhost:5000/`);
  }
});

require('dotenv').config()
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser =  require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 3000;

const indexRouter = require('./routes/index')

app.use(cors())
app.use(express.json())

const viewsPath = path.join(__dirname, "./views");
const partialsPath = path.join(__dirname, "./views/partials");

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", viewsPath);

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 60000 }
}))

app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log(`Server up and running on port: ${PORT}`)
})
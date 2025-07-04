const session = require('express-session');
const MongoStore = require("connect-mongo");
const dotenv = require('dotenv'); 
dotenv.config(); 
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

const cpocontroller = require('./controllers/cpocontroler.js');
const ticketcontroler = require('./controllers/ticketcontroler.js');
const authController = require("./controllers/auth.js");
const isSignedIn = require("./middleware/is-signed-in.js")


const Ticket = require("./models/ticket.js");
const Cpo = require("./models/cpo.js");

const app = express();

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
});

app.use(express.urlencoded({ extended: false }));
//middleware

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(methodOverride("_method"));
app.use(morgan("dev")); 
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authController);
app.use("/cpos",cpocontroller);
app.use("/tickets", ticketcontroler);

// GET welcome page/
app.get("/", async (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

//VIP thing
app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}.`);
});



app.listen(3000, () => {
  console.log('Listening on port 3000');
});
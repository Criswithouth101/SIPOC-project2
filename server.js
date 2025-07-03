const dotenv = require('dotenv'); 
dotenv.config(); 
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const cpocontroller = require('./controllers/cpocontroler.js');
const ticketcontroler = require('./controllers/ticketcontroler.js');
const Ticket = require("./models/ticket.js");
const Cpo = require("./models/cpo.js");

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
});


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev")); 

app.use("/cpos",cpocontroller);
app.use("/tickets", ticketcontroler);


// GET welcome page/
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
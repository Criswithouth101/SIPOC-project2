const dotenv = require('dotenv'); 
dotenv.config(); 
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
});

const Ticket = require("./models/ticket.js");
const Cpo = require("./models/cpo.js");

app.use(express.urlencoded({ extended: false }));

//GET form4tickets
app.get("/tickets/new", (req, res) => {
  res.render("tickets/new.ejs");
});

// POST New tickets
app.post("/tickets", async (req, res) => {
  try {
    
    req.body.allowedContact = req.body.allowedContact === "on";

    const ticketData = {
      escalationId: Number(req.body.escalationId),
      subject: req.body.subject,
      description: req.body.description,
      customerEmail: req.body.customerEmail,
      cpoName: req.body.cpoName,
      city: req.body.city,
      country: req.body.country,
      priority: Number(req.body.priority),
      status: req.body.status,
      createdAt: new Date(req.body.createdAt), // format '2024-01-01'
      brand: req.body.brand,
      allowedContact: req.body.allowedContact,
      assignedTo: req.body.assignedTo,
    };

    await Ticket.create(ticketData);

    res.redirect("/tickets");
    console.log("POST works")
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).send("Something went wrong while creating the ticket.");
  }
});

// GET welcome page/
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
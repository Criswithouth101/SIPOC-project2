const express = require("express")
const Ticket = require("../models/ticket.js")
const Cpo = require("../models/cpo.js")
const router = express.Router()

//GET form4tickets
router.get("/new", async (req, res, next) => {
    try { 
      const cpos = await Cpo.find({})
  res.render("tickets/new.ejs", {cpos});
    } catch (error){
      next(error)
    }
});

// GET /tickets index page
router.get("/", async (req, res) => {
  const allTickets = await Ticket.find();
  console.log("get works", allTickets); 
  res.render("tickets/index.ejs", { tickets: allTickets });
});

// POST New tickets
router.post("/", async (req, res) => {
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

router.get("/:ticketId", async (req, res) => {
  const foundTicket = await Ticket.findById(req.params.ticketId);
res.render("tickets/show.ejs", { ticket: foundTicket});
});

module.exports = router
const express = require("express")
const Ticket = require("../models/ticket.js")
const Cpo = require("../models/cpo.js")
const isSignedIn = require("../middleware/is-signed-in.js")


const router = express.Router()

//GET form4tickets
router.get("/new", isSignedIn, async (req, res, next) => {
    try { 
      const cpos = await Cpo.find({})
  res.render("tickets/new.ejs", {cpos});
    } catch (error){
      next(error)
    }
});

// GET /tickets index page
router.get("/", isSignedIn, async (req, res) => {
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

// GET see each ticket 
router.get("/:ticketId", isSignedIn, async (req, res) => {
  const foundTicket = await Ticket.findById(req.params.ticketId);
res.render("tickets/show.ejs", { ticket: foundTicket});
});

//Delete ticket 
router.delete("/:ticketId", async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.ticketId);
  res.redirect("/tickets");
  console.log("DELETE works for tickets")
});

//GET editing a ticket
router.get("/:ticketId/edit", isSignedIn, async (req, res) => {
  const foundTicket = await Ticket.findById(req.params.ticketId);
  const cpos = await Cpo.find({});
  res.render("tickets/edit.ejs", {ticket: foundTicket, cpos});
});

// Update tickets 

router.put("/:ticketId", async (req, res) => {
  
  if (req.body.allowedContact === "on") {
    req.body.allowedContact = true;
  } else {
    req.body.allowedContact = false;
  }
  
  await Ticket.findByIdAndUpdate(req.params.ticketId, req.body);

  res.redirect(`/tickets/${req.params.ticketId}`);
});


module.exports = router
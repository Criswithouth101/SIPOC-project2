const express = require("express")
const Cpo = require("../models/cpo.js");
const Ticket = require("../models/ticket.js");
const router = express.Router()

//GET form4cpos
router.get("/new", async (req, res, next) => {
    try { 
        res.render("cpos/new.ejs");
    } catch (error){
      next(error)
    }
});

// GET (index)
router.get("/", async (req, res) => {
  const allCpos = await Cpo.find();
  console.log("GET /cpos works", allCpos); 
  res.render("cpos/index.ejs", { cpos: allCpos });
});


// POST /cpos
router.post("/", async (req, res) => {
  try {
    
    req.body.hasSla = req.body.hasSla === "on";

    const cpoData = {
      cpoName: req.body.cpoName,
      contactEmail: req.body.contactEmail,
      hasSla: req.body.hasSla,
      city: req.body.city,
      country: req.body.country,
    };

    await Cpo.create(cpoData);

    res.redirect("/cpos");
    console.log("cpo POST works")
  } catch (error) {
    console.error("Error creating cpo:", error);
    res.status(500).send("Something went wrong on cpo");
  }
});

//POST for postman created cpos
router.post("/new", async (req,res,next) => {
    try {
        const newCpo= await Cpo.create (req.body)
        res.send("created cpo")
    } catch (error) {
        next(error)
    }
})

// GET show each cpo 
router.get("/:cpoId", async (req, res) => {
const foundCpo = await Cpo.findById(req.params.cpoId);
const cpoName = req.params.cpoName;
const tickets = await Ticket.find({ cpoName });
res.render("cpos/show.ejs", { cpo: foundCpo, tickets });
});

module.exports= router
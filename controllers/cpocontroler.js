const express = require("express")
const Cpo = require("../models/cpo.js");
const Ticket = require("../models/ticket.js");
const isSignedIn = require("../middleware/is-signed-in.js")
const router = express.Router()

//GET form4cpos
router.get("/new", isSignedIn, async (req, res, next) => {
    try { 
        res.render("cpos/new.ejs");
    } catch (error){
      next(error)
    }
});


// GET (index)
router.get("/", isSignedIn, async (req, res) => {
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
router.get("/:cpoId", isSignedIn, async (req, res) => {
const foundCpo = await Cpo.findById(req.params.cpoId);
const cpoName = req.params.cpoName;
const tickets = await Ticket.find({ cpoName });
res.render("cpos/show.ejs", { cpo: foundCpo, tickets });
});

//Delete CPO
router.delete("/:cpoId", async (req, res) => {
  await Cpo.findByIdAndDelete(req.params.cpoId);
  res.redirect("/cpos");
  console.log("DELETE works for cpo ")
});

//GET editing a partner cpo
router.get("/:cpoId/edit", isSignedIn, async (req, res) => {
  const foundCpo = await Cpo.findById(req.params.cpoId);
  res.render("cpos/edit.ejs", {cpo: foundCpo});
});


// Update the partner

router.put("/:cpoId", async (req, res) => {
  
  if (req.body.hasSla === "on") {
    req.body.hasSla = true;
  } else {
    req.body.hasSla = false;
  }
  
  await Cpo.findByIdAndUpdate(req.params.cpoId, req.body);

  res.redirect(`/cpos/${req.params.cpoId}`);
});

module.exports= router
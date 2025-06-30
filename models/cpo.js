const mongoose = require("mongoose");

const cpoSchema = new mongoose.Schema({
cpoName: String, 
contactEmail: String,
hasSla: Boolean,
city: String, 
country: String, 
tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }]
});

const Cpo = mongoose.model("Cpo", cpoSchema); 

module.exports = Cpo;


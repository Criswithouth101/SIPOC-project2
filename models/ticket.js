const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  escalationId: Number,
  subject: String,
  description: String,
  customerEmail: String,
  cpos: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Cpo'}],
  city: String, 
  country: String, 
  priority: Number,
  status: String,
  createdAt: Date,
  brand: String,
  allowedContact: Boolean,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  /*createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }*/
});

const Ticket = mongoose.model("Ticket", ticketSchema); 

module.exports = Ticket;



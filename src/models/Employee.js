const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name:  { type: String, required: true, trim: true },
  email:      { type: String, required: true, trim: true, lowercase: true, unique: true },
  position:   { type: String, required: true, trim: true },
  salary:     { type: Number, required: true, min: 0 },
  date_of_joining: { type: Date, required: true },
  department: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'employees' });

employeeSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
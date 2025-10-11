const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');

exports.listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().lean();
    res.status(200).json(employees.map(e => ({
      employee_id: e._id.toString(),
      first_name: e.first_name,
      last_name: e.last_name,
      email: e.email,
      position: e.position,
      salary: e.salary,
      date_of_joining: e.date_of_joining,
      department: e.department
    })));
  } catch (e) { next(e); }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: false, errors: errors.array() });

    const emp = await Employee.create(req.body);
    res.status(201).json({ message: 'Employee created successfully.', employee_id: emp._id.toString() });
  } catch (e) {
    if (e.code === 11000) { e.status = 409; e.message = 'Employee email already exists'; }
    next(e);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.eid).lean();
    if (!emp) return res.status(404).json({ status: false, message: 'Employee not found' });
    res.status(200).json({
      employee_id: emp._id.toString(),
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining,
      department: emp.department
    });
  } catch (e) { next(e); }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: false, errors: errors.array() });

    const updated = await Employee.findByIdAndUpdate(
      req.params.eid,
      { $set: { ...req.body, updated_at: new Date() } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ status: false, message: 'Employee not found' });
    res.status(200).json({ message: 'Employee details updated successfully.' });
  } catch (e) { next(e); }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const { eid } = req.query;
    if (!eid) return res.status(400).json({ status: false, message: 'eid query parameter is required' });
    const deleted = await Employee.findByIdAndDelete(eid);
    if (!deleted) return res.status(404).json({ status: false, message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (e) { next(e); }
};

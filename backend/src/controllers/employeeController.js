const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');

function buildBasePath() {
  const raw = process.env.CONTEXT_PATH || '/gbc-service/comp3123';
  const ctx = raw.startsWith('/') ? raw : `/${raw}`;
  return ctx !== '/' && ctx.endsWith('/') ? ctx.slice(0, -1) : ctx;
}

function buildPhotoUrl(profilePath, req) {
  if (!profilePath) return null;
  if (/^https?:\/\//i.test(profilePath)) return profilePath;
  const basePath = buildBasePath();
  const normalized = profilePath.startsWith('/') ? profilePath : `${basePath}/${profilePath}`;
  return `${req.protocol}://${req.get('host')}${normalized}`;
}

function formatEmployee(emp, req) {
  return {
    employee_id: emp._id.toString(),
    first_name: emp.first_name,
    last_name: emp.last_name,
    email: emp.email,
    position: emp.position,
    salary: emp.salary,
    date_of_joining: emp.date_of_joining,
    department: emp.department,
    profile_image_url: buildPhotoUrl(emp.profile_image_url, req)
  };
}

exports.listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().lean();
    res.status(200).json(employees.map(e => formatEmployee(e, req)));
  } catch (e) { next(e); }
};

exports.searchEmployees = async (req, res, next) => {
  try {
    const { department, position } = req.query;
    if (!department && !position) {
      return res.status(400).json({ status: false, message: 'Provide department or position to search' });
    }

    const filter = {};
    if (department) filter.department = new RegExp(department, 'i');
    if (position) filter.position = new RegExp(position, 'i');

    const employees = await Employee.find(filter).lean();
    res.status(200).json(employees.map(e => formatEmployee(e, req)));
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
    res.status(200).json(formatEmployee(emp, req));
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

exports.uploadEmployeePhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ status: false, message: 'No file uploaded' });
    const emp = await Employee.findById(req.params.eid);
    if (!emp) return res.status(404).json({ status: false, message: 'Employee not found' });

    const rawContextPath = process.env.CONTEXT_PATH || '/gbc-service/comp3123';
    const contextPath = rawContextPath.startsWith('/') ? rawContextPath : `/${rawContextPath}`;
    const basePath = contextPath !== '/' && contextPath.endsWith('/') ? contextPath.slice(0, -1) : contextPath;
    const urlPath = `${basePath}/uploads/${req.file.filename}`;

    const absoluteUrl = `${req.protocol}://${req.get('host')}${urlPath}`;
    emp.profile_image_url = urlPath;
    await emp.save();

    res.status(200).json({ message: 'Profile image uploaded successfully.', profile_image_url: absoluteUrl });
  } catch (e) { next(e); }
};

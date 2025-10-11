const express = require('express');
const { body } = require('express-validator');
const {
  listEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee
} = require('../controllers/employeeController');

const router = express.Router();

router.get('/employees', listEmployees);

router.post('/employees', [
  body('first_name').isString().trim().notEmpty(),
  body('last_name').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('position').isString().trim().notEmpty(),
  body('salary').isNumeric(),
  body('date_of_joining').isISO8601().toDate(),
  body('department').isString().trim().notEmpty()
], createEmployee);

router.get('/employees/:eid', getEmployeeById);

router.put('/employees/:eid', [
  body().custom(b => {
    const allowed = ['first_name','last_name','email','position','salary','date_of_joining','department'];
    const keys = Object.keys(b || {});
    if (keys.length === 0) throw new Error('At least one field is required');
    const invalid = keys.filter(k => !allowed.includes(k));
    if (invalid.length) throw new Error('Invalid fields: ' + invalid.join(', '));
    return true;
  }),
  body('email').optional().isEmail().normalizeEmail(),
  body('salary').optional().isNumeric(),
  body('date_of_joining').optional().isISO8601().toDate()
], updateEmployee);

router.delete('/employees', deleteEmployee);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const {
  listEmployees, searchEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee
  , uploadEmployeePhoto
} = require('../controllers/employeeController');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(10).toString('hex');
    cb(null, `${Date.now()}-${randomName}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const uploadPhoto = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ status: false, message: 'File too large (max 10MB)' });
    }
    return res.status(400).json({ status: false, message: err.message || 'File upload failed' });
  });
};

router.get('/employees', listEmployees);
router.get('/employees/search', searchEmployees);
router.post('/employees/:eid/photo', uploadPhoto, uploadEmployeePhoto);

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

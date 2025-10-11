const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', [
  body('username').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 })
], signup);

router.post('/login', [
  body('password').isString().isLength({ min: 6 }),
  body().custom(b => { if (!b.email && !b.username) throw new Error('Provide email or username'); return true; })
], login);

module.exports = router;

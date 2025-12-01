const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: false, errors: errors.array() });

    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ status: false, message: 'User already exists' });

    const hashed = await hashPassword(password);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'User created successfully.', user_id: user._id.toString() });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: false, errors: errors.array() });

    const { email, username, password } = req.body;
    const user = await User.findOne(email ? { email } : { username });
    if (!user) return res.status(401).json({ status: false, message: 'Invalid Username and password' });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ status: false, message: 'Invalid Username and password' });

    let jwt_token;
    try {
      jwt_token = jwt.sign({ sub: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '2h' });
    } catch {}
    const resp = { message: 'Login successful.' };
   if (jwt_token) {
      res.set('Authorization', `Bearer ${jwt_token}`);
      resp.jwt_token = jwt_token;
    }

    res.status(200).json(resp);
  } catch (e) { next(e); }
};

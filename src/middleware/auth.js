const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = (authHeader.startsWith('Bearer') ? authHeader: null).replace('Bearer', '').trim();
  console.log('Auth Token:', token);
  if (!token) return res.status(401).json({ status: false, message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ status: false, message: 'Invalid token' });
  }
}
module.exports = { authRequired };

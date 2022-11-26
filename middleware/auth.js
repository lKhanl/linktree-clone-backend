const jwt = require('jsonwebtoken');
const config = require('../config');

const { JWT_SECRET } = config;

module.exports = (req, res, next) => {
  let token = req.header('Authorization');

  // Check for token
  if (!token)
    return res.status(401).json({ msg: 'No token, authorization denied' });

  token = token.replace('Bearer ', '');

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
};

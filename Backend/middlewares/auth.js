const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  // console.log('🚀 Received Authorization header:', authHeader); // ✅ Log

  if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('✅ Decoded JWT:', decoded); // ✅ Log
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ JWT Verification Failed:', err.message); // ✅ Log
    res.status(401).json({ msg: 'Invalid token' });
  }
};




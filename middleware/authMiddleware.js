const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // console.log("🚀 ~ verifyToken ~ req:", req)
  // Get the token from the authorization header

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  // console.log("🚀 ~ verifyToken ~ token:", token)

  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // invalid token
    
        if (!user.verified) {
            return res.status(423).json({ message: 'Verify Email.', data: [] });
        }
    req.user = user; // Add the user payload to the request
    if (!req.user) {
        return res.sendStatus(401); // Unauthorized
    }
    next(); // proceed to the next middleware or route handler
  });
};


module.exports = {
  verifyToken
};

// module.exports = verifyToken;
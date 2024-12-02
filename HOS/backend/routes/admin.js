const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();


const adminCredentials = { username: 'admin', password: 'admin' };


const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in the environment variables.");
  process.exit(1); 
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // admin blogin
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (username === adminCredentials.username && password === adminCredentials.password) {
    
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;

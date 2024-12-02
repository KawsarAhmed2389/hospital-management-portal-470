const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
require('dotenv').config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// JWT_SECRET
if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}

// Register doctor
router.post('/dregister', async (req, res) => {
    const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;

    if (!firstName || !lastName || !email || !sex || !dateOfBirth || !mobileNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        
        const existingDoctor = await Doctor.findOne({ $or: [{ email }, { mobileNumber }] });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Email or mobile number already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        // Create doctor document
        const newDoctor = new Doctor({
            firstName,
            lastName,
            email,
            sex,
            dateOfBirth,
            mobileNumber,
            password: hashedPassword
        });

        
        await newDoctor.save();

        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login doctor
router.post('/dlogin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        
        const payload = {
            doctor: {
                id: doctor.id
            }
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

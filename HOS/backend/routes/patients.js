const express = require('express');
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//JWT_SECRET 
if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}

// Register patient
router.post('/pregister', async (req, res) => {
    const { firstName, lastName, email, sex, dateOfBirth, mobileNumber, password } = req.body;

    
    if (!firstName || !lastName || !email || !sex || !dateOfBirth || !mobileNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        
        const existingPatient = await Patient.findOne({ $or: [{ email }, { mobileNumber }] });
        if (existingPatient) {
            return res.status(400).json({ message: 'Email or mobile number already exists' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create patient document
        const newPatient = new Patient({
            firstName,
            lastName,
            email,
            sex,
            dateOfBirth,
            mobileNumber,
            password: hashedPassword
        });

        await newPatient.save();

        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login patient
router.post('/plogin', async (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

       
        const payload = {
            patient: {
                id: patient.id
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

const express = require('express');
const router = express.Router();
const ContactSubmission = require('../models/contact'); // Import the model

// POST /api/contact - Receives and saves form submissions
router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email, and interest are required.' });
        }

        const newSubmission = new ContactSubmission({
            name,
            email,
            phone,
            message // This comes from the 'name' attribute of your select box
        });

        // Save the new submission to the database
        await newSubmission.save();

        // Send a success response back to the form
        res.status(201).json({ success: true, message: 'Message received successfully! We will get back to you soon.' });

    } catch (error) {
        console.error("Error saving contact submission:", error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

module.exports = router;

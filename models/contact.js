const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a contact submission
const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false // Phone is not marked as required in the form
    },
    message: {
        type: String,
        required: true // This will hold the value from the 'I'm interested in...' select box
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model from the schema
const ContactSubmission = mongoose.model('ContactSubmission', contactSchema);

// Export the model
module.exports = ContactSubmission;

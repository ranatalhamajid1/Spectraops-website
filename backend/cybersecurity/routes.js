const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get cybersecurity services listing
router.get('/services', async (req, res) => {
    try {
        const services = await db.all(
            "SELECT * FROM contact_services WHERE service_code IN ('penetration-testing', 'soc-consultation', 'security-training', 'red-teaming')"
        );
        return res.json({ success: true, services });
    } catch (error) {
        console.error('Cybersecurity services error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch cybersecurity services' });
    }
});

// Book consultation for security service
router.post('/consult', async (req, res) => {
    const { name, email, company, serviceCode, notes } = req.body;

    if (!name || !email || !serviceCode) {
        return res.status(400).json({ success: false, error: 'Name, email, and service code are required' });
    }

    try {
        // Create CRM lead
        const result = await db.run(
            `INSERT INTO crm_leads (name, email, company, source, status, notes)
             VALUES (?, ?, ?, 'cybersecurity_division', 'new', ?)`,
            [name, email, company || null, `Requested Consult for: ${serviceCode}\nNotes: ${notes || 'None'}`]
        );

        return res.status(201).json({
            success: true,
            message: 'Consultation request received. A security architect will contact you shortly.',
            leadId: result.id
        });
    } catch (error) {
        console.error('Cybersecurity consult error:', error);
        return res.status(500).json({ success: false, error: 'Failed to process request' });
    }
});

module.exports = router;

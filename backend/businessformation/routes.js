const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get corporate pricing models
router.get('/pricing', (req, res) => {
    return res.json({
        success: true,
        pricing: {
            usLlc: {
                basePrice: 199,
                includes: ['State Filing', 'EIN Application', 'BOI Filing', 'Registered Agent (1 Yr)', 'Operating Agreement']
            },
            ukLtd: {
                basePrice: 99,
                includes: ['Companies House Filing', 'Digital Shares Certs', 'Corporate Address', 'Compliance Support']
            },
            itin: {
                basePrice: 199,
                includes: ['Document Pre-verification', 'W-7 App Submission', 'IRS Tracking Support']
            }
        }
    });
});

// Setup custom corporate package order
router.post('/checkout', async (req, res) => {
    const { name, email, phone, companyName, formationType, bankingOptions, gatewayOptions } = req.body;

    if (!name || !email || !formationType) {
        return res.status(400).json({ success: false, error: 'Name, email, and formation type are required' });
    }

    try {
        // Create CRM lead
        const lead = await db.run(
            `INSERT INTO crm_leads (name, email, phone, company, source, status, notes)
             VALUES (?, ?, ?, ?, 'business_formation_sales', 'new', ?)`,
            [
                name,
                email,
                phone || null,
                companyName || null,
                `Corporate Setup Request\nType: ${formationType}\nBanks: ${bankingOptions?.join(', ') || 'None'}\nGateways: ${gatewayOptions?.join(', ') || 'None'}`
            ]
        );

        // Calculate price based on selected options
        const priceMap = { 'llc': 199, 'ltd': 99, 'itin': 199 };
        const basePrice = priceMap[formationType.toLowerCase()] || 199;

        // Create CRM order linked to this lead
        const order = await db.run(
            `INSERT INTO crm_orders (client_id, order_type, status, amount, payment_status, details_json)
             VALUES (?, ?, 'pending', ?, 'unpaid', ?)`,
            [
                lead.id,
                formationType.toLowerCase(),
                basePrice,
                JSON.stringify({ bankingOptions, gatewayOptions, companyName })
            ]
        );

        return res.status(201).json({
            success: true,
            message: 'Corporate formation package checkout initialized',
            orderId: order.id,
            clientId: lead.id,
            amount: basePrice
        });

    } catch (error) {
        console.error('Corporate formation checkout error:', error);
        return res.status(500).json({ success: false, error: 'Failed to process corporate package' });
    }
});

module.exports = router;

const express = require('express');

const router = express.Router();

// Get list of supported banking partners and payment gateways
router.get('/providers', (req, res) => {
    return res.json({
        success: true,
        gateways: [
            { id: 'stripe', name: 'Stripe', type: 'Merchant Account', setupTime: '3-5 days' },
            { id: 'paypal', name: 'PayPal Business', type: 'Merchant Account', setupTime: '1-2 days' },
            { id: 'square', name: 'Square', type: 'Merchant Account', setupTime: '2-4 days' }
        ],
        bankingPartners: [
            { id: 'payoneer', name: 'Payoneer', region: 'Global' },
            { id: 'wise', name: 'Wise Business', region: 'US/UK/EU' },
            { id: 'airwallex', name: 'Airwallex', region: 'Global' },
            { id: 'revolut', name: 'Revolut Business', region: 'UK/EU/US' }
        ]
    });
});

module.exports = router;

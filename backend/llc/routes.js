const express = require('express');

const router = express.Router();

// Get list of popular US states for LLC filing
router.get('/states', (req, res) => {
    return res.json({
        success: true,
        states: [
            { code: 'WY', name: 'Wyoming', stateFee: 102, benefits: 'No state income tax, low annual fees, privacy' },
            { code: 'DE', name: 'Delaware', stateFee: 110, benefits: 'Corporate-friendly courts, no tax for non-residents' },
            { code: 'NM', name: 'New Mexico', stateFee: 50, benefits: 'Very low state fees, complete anonymity, no annual reports' },
            { code: 'FL', name: 'Florida', stateFee: 125, benefits: 'Strong regional banking connections, popular for retail/ecom' }
        ]
    });
});

module.exports = router;

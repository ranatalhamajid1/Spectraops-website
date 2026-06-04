const express = require('express');

const router = express.Router();

// Get ITIN application eligibility rules
router.get('/eligibility', (req, res) => {
    return res.json({
        success: true,
        criteria: [
            'Non-resident alien required to file a U.S. tax return',
            'U.S. resident alien filing a U.S. tax return based on days present',
            'Dependent or spouse of a U.S. citizen/resident alien',
            'Non-resident alien claiming a tax treaty benefit'
        ],
        documentsRequired: [
            'Certified copy of passport or birth certificate/national ID',
            'Completed Form W-7',
            'Valid tax reason / tax return attachment'
        ]
    });
});

module.exports = router;

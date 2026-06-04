const express = require('express');

const router = express.Router();

// Get UK LTD filing guidelines and checklist
router.get('/requirements', (req, res) => {
    return res.json({
        success: true,
        requirements: {
            officers: 'At least one Director (natural person over 16) and one Shareholder required. Director can be shareholder.',
            address: 'Must have a registered physical address in the UK (England/Wales, Scotland, or NI) to receive official notifications.',
            documentation: ['Memorandum of Association', 'Articles of Association', 'Share Certificates digital copies']
        }
    });
});

module.exports = router;

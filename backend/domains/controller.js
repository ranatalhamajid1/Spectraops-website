const dns = require('dns').promises;
const db = require('../config/database');

class DomainsController {
    // 1. Public: Search Domain Availability & get details
    async searchDomain(req, res) {
        const { domainName } = req.body;

        if (!domainName) {
            return res.status(400).json({ success: false, error: 'Domain name is required' });
        }

        // Clean domain
        let domain = domainName.toLowerCase().trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '');
        
        // Basic domain validation
        if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) {
            return res.status(400).json({ success: false, error: 'Invalid domain format' });
        }

        try {
            let available = false;

            // Perform a quick DNS resolve lookup to verify availability
            try {
                // If it resolves, it's NOT available
                await dns.resolve4(domain);
                available = false;
            } catch (err) {
                // If DNS fails with ENOTFOUND, it is likely available
                if (err.code === 'ENOTFOUND') {
                    available = true;
                } else {
                    available = false;
                }
            }

            // Generate brand suggestions based on name
            const nameParts = domain.split('.');
            const name = nameParts[0];
            const originalTld = nameParts[1] || 'com';
            
            const extensions = ['com', 'net', 'org', 'io', 'co', 'app', 'security', 'tech'];
            const suggestions = [];

            for (const ext of extensions) {
                if (ext !== originalTld) {
                    suggestions.push({
                        domain: `${name}.${ext}`,
                        available: Math.random() > 0.3 // Simulate availability for suggestions
                    });
                }
            }

            // Log search history in the database
            await db.run(
                'INSERT INTO domain_search_history (domain_name, is_available, checked_by) VALUES (?, ?, ?)',
                [domain, available ? 1 : 0, req.user ? req.user.username : 'visitor']
            );

            return res.json({
                success: true,
                domain: domain,
                available: available,
                registrar: available ? 'Available to Register via ReadyTitles' : 'Unavailable (Registered)',
                suggestions: suggestions.slice(0, 5),
                message: available 
                    ? `🎉 Good news! ${domain} is available for registration.` 
                    : `🔒 Sorry, ${domain} is already registered.`
            });

        } catch (error) {
            console.error('searchDomain error:', error);
            return res.status(500).json({ success: false, error: 'Domain search failed' });
        }
    }

    // 2. Admin: Get domain search logs history
    async getSearchHistory(req, res) {
        try {
            const logs = await db.all('SELECT * FROM domain_search_history ORDER BY id DESC LIMIT 50');
            return res.json({ success: true, history: logs });
        } catch (error) {
            console.error('getSearchHistory error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch search history' });
        }
    }
}

module.exports = new DomainsController();

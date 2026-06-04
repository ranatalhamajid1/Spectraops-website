const fs = require('fs').promises;
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');

class SettingsController {
    // Read site settings
    async getSettings(req, res) {
        try {
            let settingsData = {};
            try {
                const data = await fs.readFile(SETTINGS_FILE, 'utf8');
                settingsData = JSON.parse(data);
            } catch (err) {
                // If file doesn't exist, create it with default config
                settingsData = {
                    branding: {
                        siteName: 'SpectraOps Ltd',
                        tagline: 'Secure. Scale. Succeed.'
                    },
                    apis: {
                        hibpEnabled: false,
                        virustotalEnabled: false,
                        abuseipdbEnabled: false
                    },
                    smtp: {
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        user: 'spectraopsofficial@gmail.com'
                    },
                    payments: {
                        stripePublicKey: '',
                        paypalClientId: ''
                    }
                };
                
                // Ensure data directory exists
                const dataDir = path.dirname(SETTINGS_FILE);
                await fs.mkdir(dataDir, { recursive: true });
                await fs.writeFile(SETTINGS_FILE, JSON.stringify(settingsData, null, 4), 'utf8');
            }

            // Exclude secret keys for general admin reading if needed, or return full object for super-admin
            return res.json({ success: true, settings: settingsData });

        } catch (error) {
            console.error('getSettings error:', error);
            return res.status(500).json({ success: false, error: 'Failed to retrieve site settings' });
        }
    }

    // Save site settings
    async updateSettings(req, res) {
        const newSettings = req.body;

        try {
            // Validate incoming format
            if (!newSettings || typeof newSettings !== 'object') {
                return res.status(400).json({ success: false, error: 'Invalid settings body' });
            }

            // In production, we'd validate structures and write to process.env where applicable
            await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
            await fs.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 4), 'utf8');

            // Apply environment overrides at runtime if needed
            if (newSettings.apis?.virustotalApiKey) {
                process.env.VIRUSTOTAL_API_KEY = newSettings.apis.virustotalApiKey;
            }
            if (newSettings.apis?.hibpApiKey) {
                process.env.HIBP_API_KEY = newSettings.apis.hibpApiKey;
            }
            if (newSettings.apis?.abuseipdbApiKey) {
                process.env.ABUSEIPDB_API_KEY = newSettings.apis.abuseipdbApiKey;
            }

            return res.json({ success: true, message: 'Settings updated and applied successfully' });

        } catch (error) {
            console.error('updateSettings error:', error);
            return res.status(500).json({ success: false, error: 'Failed to save site settings' });
        }
    }
}

module.exports = new SettingsController();

const db = require('../config/database');

class AnalyticsController {
    // Record page visit (Public)
    async logVisit(req, res) {
        const { pageUrl, referrer, sessionId, visitDuration, deviceType, browserName, country } = req.body;

        try {
            await db.run(
                `INSERT INTO website_analytics (
                    page_url, visitor_ip, user_agent, referrer, session_id, visit_duration, device_type, browser_name, country
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    pageUrl || '/',
                    req.ip || '127.0.0.1',
                    req.get('User-Agent') || 'Unknown',
                    referrer || null,
                    sessionId || null,
                    visitDuration || 0,
                    deviceType || 'Desktop',
                    browserName || 'Unknown Browser',
                    country || 'Unknown'
                ]
            );

            return res.json({ success: true });
        } catch (error) {
            console.error('logVisit error:', error);
            return res.status(500).json({ success: false, error: 'Failed to log visit' });
        }
    }

    // Get aggregated admin stats (Guarded)
    async getAdminOverview(req, res) {
        try {
            const stats = {};

            // 1. Leads counts
            const totalLeads = await db.get('SELECT COUNT(*) as count FROM crm_leads');
            stats.totalLeads = totalLeads.count;

            const newLeads = await db.get('SELECT COUNT(*) as count FROM crm_leads WHERE status = \'new\'');
            stats.newLeads = newLeads.count;

            // 2. Orders revenue
            const revenue = await db.get('SELECT SUM(amount) as total, COUNT(*) as count FROM crm_orders WHERE payment_status = \'paid\'');
            stats.totalRevenue = revenue.total || 0;
            stats.paidOrdersCount = revenue.count || 0;

            const pendingRevenue = await db.get('SELECT SUM(amount) as total FROM crm_orders WHERE payment_status = \'unpaid\'');
            stats.pendingRevenue = pendingRevenue.total || 0;

            // 3. Tool usage count
            const toolsUsed = await db.get('SELECT COUNT(*) as count FROM security_tool_usage');
            const successfulTools = await db.get('SELECT COUNT(*) as count FROM security_tool_usage WHERE success = 1');
            stats.totalSecurityToolsUsed = toolsUsed.count;
            stats.toolSuccessRate = toolsUsed.count > 0 ? Math.round((successfulTools.count / toolsUsed.count) * 100) : 100;

            // 4. Traffic views
            const traffic = await db.get('SELECT COUNT(*) as count FROM website_analytics');
            stats.totalPageViews = traffic.count;

            // 5. Recent orders details
            stats.recentOrders = await db.all(
                `SELECT o.*, l.name as client_name 
                 FROM crm_orders o 
                 LEFT JOIN crm_leads l ON o.client_id = l.id 
                 ORDER BY o.id DESC LIMIT 5`
            );

            // 6. Recent tool logs
            stats.recentToolsLog = await db.all(
                'SELECT id, tool_name, success, processing_time_ms, created_at FROM security_tool_usage ORDER BY id DESC LIMIT 5'
            );

            return res.json({ success: true, data: stats });

        } catch (error) {
            console.error('getAdminOverview error:', error);
            return res.status(500).json({ success: false, error: 'Failed to gather analytics metrics' });
        }
    }

    // Get traffic by browser and country (Guarded)
    async getTrafficDetails(req, res) {
        try {
            const countryStats = await db.all(
                'SELECT country, COUNT(*) as count FROM website_analytics GROUP BY country ORDER BY count DESC LIMIT 10'
            );

            const browserStats = await db.all(
                'SELECT browser_name as browser, COUNT(*) as count FROM website_analytics GROUP BY browser_name ORDER BY count DESC'
            );

            const pageStats = await db.all(
                'SELECT page_url as url, COUNT(*) as count FROM website_analytics GROUP BY page_url ORDER BY count DESC LIMIT 10'
            );

            return res.json({
                success: true,
                countries: countryStats,
                browsers: browserStats,
                pages: pageStats
            });
        } catch (error) {
            console.error('getTrafficDetails error:', error);
            return res.status(500).json({ success: false, error: 'Failed to retrieve traffic details' });
        }
    }
}

module.exports = new AnalyticsController();

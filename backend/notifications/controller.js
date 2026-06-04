const db = require('../config/database');

class NotificationsController {
    // 1. Public Contact Form Submission (Triggers lead insert + email notification log)
    async submitContactForm(req, res) {
        const { fullName, email, phoneNumber, companyName, serviceInterest, subject, message, mathAnswer } = req.body;

        // Basic verification
        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({ success: false, error: 'Name, email, subject, and message are required' });
        }

        // Verify captcha
        const expectedCaptcha = 6; // 1 + 5 = 6
        if (parseInt(mathAnswer) !== expectedCaptcha) {
            return res.status(400).json({ success: false, error: 'Incorrect captcha verification code' });
        }

        try {
            // Save as lead in CRM first to connect context
            const leadResult = await db.run(
                `INSERT INTO crm_leads (name, email, phone, company, source, status, notes)
                 VALUES (?, ?, ?, ?, 'contact_form', 'new', ?)`,
                [fullName, email, phoneNumber || null, companyName || null, `Subject: ${subject}\nInterest: ${serviceInterest || 'General'}\nMessage: ${message}`]
            );

            // Log submission in contact submissions (legacy support)
            const contactResult = await db.run(
                `INSERT INTO contact_submissions (
                    name, email, phone, company, subject, message, service_type, ip_address, source
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'contact_form')`,
                [fullName, email, phoneNumber || null, companyName || null, subject, message, serviceInterest || 'general', req.ip || '127.0.0.1']
            );

            // Create notification emails in the queue
            // A. Admin notification email
            await db.run(
                `INSERT INTO email_notifications (recipient_email, subject, body, email_type, related_id, status)
                 VALUES (?, ?, ?, 'admin_alert', ?, 'pending')`,
                [
                    'contact@spectraops.com',
                    `[New Contact Request] ${subject}`,
                    `You have received a new message from ${fullName} (${email}).\nCompany: ${companyName || 'N/A'}\nMessage:\n${message}`,
                    contactResult.id
                ]
            );

            // B. Client confirmation email
            await db.run(
                `INSERT INTO email_notifications (recipient_email, subject, body, email_type, related_id, status)
                 VALUES (?, ?, ?, 'client_receipt', ?, 'pending')`,
                [
                    email,
                    'Thank you for contacting SpectraOps',
                    `Hello ${fullName},\n\nWe have received your request regarding "${subject}". Our team will analyze it and respond within 24 hours.\n\nBest regards,\nSpectraOps Security Team`,
                    contactResult.id
                ]
            );

            return res.json({
                success: true,
                message: `Thank you ${fullName}! Your request has been logged. Reference code: SP-${contactResult.id}`,
                referenceCode: `SP-${contactResult.id}`
            });

        } catch (error) {
            console.error('submitContactForm error:', error);
            return res.status(500).json({ success: false, error: 'Failed to process contact request' });
        }
    }

    // 2. Public newsletter subscribe
    async subscribeNewsletter(req, res) {
        const { email } = req.body;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ success: false, error: 'Valid email is required' });
        }

        try {
            // Log as lead
            await db.run(
                `INSERT INTO crm_leads (name, email, source, status, notes)
                 VALUES (?, ?, 'newsletter', 'new', 'Newsletter subscription active')`,
                [email.split('@')[0], email]
            );

            // Queue welcome email
            await db.run(
                `INSERT INTO email_notifications (recipient_email, subject, body, email_type, status)
                 VALUES (?, 'Subscribed to SpectraOps Newsletter', 'Thank you for subscribing to our threat intelligence advisories and updates.', 'newsletter_welcome')`,
                [email]
            );

            return res.json({
                success: true,
                message: 'Successfully subscribed to SpectraOps newsletters'
            });

        } catch (error) {
            console.error('subscribeNewsletter error:', error);
            return res.status(500).json({ success: false, error: 'Subscription failed' });
        }
    }

    // 3. Admin: Get email notification queue logs
    async getNotificationLogs(req, res) {
        try {
            const logs = await db.all('SELECT * FROM email_notifications ORDER BY id DESC LIMIT 50');
            return res.json({ success: true, logs });
        } catch (error) {
            console.error('getNotificationLogs error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch notification logs' });
        }
    }
}

module.exports = new NotificationsController();

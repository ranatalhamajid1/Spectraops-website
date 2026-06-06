const db = require('../config/database');
const emailService = require('../services/emailService');

class CrmController {
    // ===== LEADS MANAGEMENT =====

    // Get list of leads with filters
    async getLeads(req, res) {
        const { status, source, assignedTo } = req.query;
        let query = 'SELECT l.*, u.full_name as assigned_agent_name FROM crm_leads l LEFT JOIN admin_users u ON l.assigned_to = u.id WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND l.status = ?';
            params.push(status);
        }
        if (source) {
            query += ' AND l.source = ?';
            params.push(source);
        }
        if (assignedTo) {
            query += ' AND l.assigned_to = ?';
            params.push(assignedTo);
        }

        query += ' ORDER BY l.id DESC';

        try {
            const leads = await db.all(query, params);
            return res.json({ success: true, leads });
        } catch (error) {
            console.error('getLeads error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch leads' });
        }
    }

    // Get lead details by ID (including their orders)
    async getLeadById(req, res) {
        const { id } = req.params;

        try {
            const lead = await db.get(
                'SELECT l.*, u.full_name as assigned_agent_name FROM crm_leads l LEFT JOIN admin_users u ON l.assigned_to = u.id WHERE l.id = ?',
                [id]
            );

            if (!lead) {
                return res.status(404).json({ success: false, error: 'Lead not found' });
            }

            const orders = await db.all('SELECT * FROM crm_orders WHERE client_id = ? ORDER BY id DESC', [id]);

            return res.json({
                success: true,
                lead,
                orders
            });
        } catch (error) {
            console.error('getLeadById error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch lead details' });
        }
    }

    // Create a new lead (public or admin created)
    async createLead(req, res) {
        const { name, email, phone, company, source, status, notes, turnstileToken } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, error: 'Name and email are required' });
        }

        // Exclude authenticated admins from Turnstile validation
        const isAuthenticatedAdmin = req.user !== undefined;

        if (!isAuthenticatedAdmin && process.env.TURNSTILE_ENABLED !== 'false') {
            if (!turnstileToken) {
                return res.status(400).json({ success: false, error: 'Security verification (Turnstile) is required.' });
            }
            const isHuman = await CrmController.verifyTurnstile(turnstileToken, req.ip);
            if (!isHuman) {
                return res.status(400).json({ success: false, error: 'Security verification failed. Please try again.' });
            }
        }

        // Robustly parse the message / details from various form inputs
        const finalMessage = notes || req.body.message || req.body.details || 'New CRM Lead registration';
        const finalSubject = req.body.subject || req.body.service_type || source || 'General Inquiry';

        try {
            // 1. Insert into crm_leads
            const result = await db.run(
                `INSERT INTO crm_leads (name, email, phone, company, source, status, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    name,
                    email,
                    phone || null,
                    company || null,
                    source || 'manual',
                    status || 'new',
                    finalMessage
                ]
            );

            // 2. Also log in contact_submissions so it shows up in the inquiries dashboard section
            await db.run(
                `INSERT INTO contact_submissions (name, email, phone, company, subject, message, service_type, source, ip_address)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    name,
                    email,
                    phone || null,
                    company || null,
                    finalSubject,
                    finalMessage,
                    req.body.service_type || null,
                    source || 'website',
                    req.ip || '127.0.0.1'
                ]
            );

            // 3. Send email notification to the administrator
            try {
                await emailService.sendEmail(
                    'spectraopsofficial@gmail.com',
                    `[SpectraOps CRM Lead] New Inquiry: ${finalSubject}`,
                    'default',
                    {
                        subject: `New Inquiry from ${name}`,
                        content: `
                            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                                <h3 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 8px;">New Contact Inquiry Received</h3>
                                <p><strong>Name:</strong> ${name}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Company:</strong> ${company || 'N/A'}</p>
                                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                                <p><strong>Source:</strong> ${source || 'N/A'}</p>
                                <p><strong>Subject:</strong> ${finalSubject}</p>
                                <p><strong>Message / Specifications:</strong></p>
                                <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1; font-style: italic;">
                                    ${finalMessage.replace(/\n/g, '<br />')}
                                </div>
                            </div>
                        `
                    }
                );
                console.log(`📧 Notification email sent successfully to spectraopsofficial@gmail.com`);
            } catch (mailErr) {
                console.error('❌ Failed to dispatch email notification:', mailErr.message);
            }

            return res.status(201).json({
                success: true,
                message: 'Lead created successfully',
                leadId: result.id
            });
        } catch (error) {
            console.error('createLead error:', error);
            return res.status(500).json({ success: false, error: 'Failed to create lead' });
        }
    }

    // Helper to verify Cloudflare Turnstile token
    static async verifyTurnstile(token, ip) {
        const secret = process.env.TURNSTILE_SECRET_KEY || '1x00000000000000000000000000000000';
        try {
            const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}&remoteip=${encodeURIComponent(ip || '')}`
            });
            const data = await response.json();
            return data.success;
        } catch (err) {
            console.error('Turnstile verification error:', err);
            return true; // Fail open in case Cloudflare service is unreachable
        }
    }

    // Update lead info, notes, follow ups, status, or assigned agent
    async updateLead(req, res) {
        const { id } = req.params;
        const { name, email, phone, company, status, notes, assignedTo } = req.body;

        try {
            const lead = await db.get('SELECT * FROM crm_leads WHERE id = ?', [id]);
            if (!lead) {
                return res.status(404).json({ success: false, error: 'Lead not found' });
            }

            const updates = [];
            const params = [];

            if (name) { updates.push('name = ?'); params.push(name); }
            if (email) { updates.push('email = ?'); params.push(email); }
            if (phone) { updates.push('phone = ?'); params.push(phone); }
            if (company) { updates.push('company = ?'); params.push(company); }
            if (status) { updates.push('status = ?'); params.push(status); }
            if (notes) { updates.push('notes = ?'); params.push(notes); }
            if (assignedTo !== undefined) { updates.push('assigned_to = ?'); params.push(assignedTo); }

            if (updates.length === 0) {
                return res.status(400).json({ success: false, error: 'No fields to update' });
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');
            params.push(id);

            await db.run(
                `UPDATE crm_leads SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            return res.json({ success: true, message: 'Lead updated successfully' });

        } catch (error) {
            console.error('updateLead error:', error);
            return res.status(500).json({ success: false, error: 'Failed to update lead' });
        }
    }

    // ===== ORDERS MANAGEMENT =====

    // Get list of all orders
    async getOrders(req, res) {
        const { orderType, status, paymentStatus } = req.query;
        let query = `
            SELECT o.*, l.name as client_name, l.email as client_email 
            FROM crm_orders o 
            LEFT JOIN crm_leads l ON o.client_id = l.id 
            WHERE 1=1
        `;
        const params = [];

        if (orderType) {
            query += ' AND o.order_type = ?';
            params.push(orderType);
        }
        if (status) {
            query += ' AND o.status = ?';
            params.push(status);
        }
        if (paymentStatus) {
            query += ' AND o.payment_status = ?';
            params.push(paymentStatus);
        }

        query += ' ORDER BY o.id DESC';

        try {
            const orders = await db.all(query, params);
            return res.json({ success: true, orders });
        } catch (error) {
            console.error('getOrders error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
        }
    }

    // Create a new order
    async createOrder(req, res) {
        const { clientId, orderType, amount, paymentStatus, detailsJson } = req.body;

        if (!orderType || !amount) {
            return res.status(400).json({ success: false, error: 'Order type and amount are required' });
        }

        try {
            if (clientId) {
                // Verify client exists
                const client = await db.get('SELECT id FROM crm_leads WHERE id = ?', [clientId]);
                if (!client) {
                    return res.status(400).json({ success: false, error: 'Invalid client ID' });
                }
            }

            const result = await db.run(
                `INSERT INTO crm_orders (client_id, order_type, status, amount, payment_status, details_json)
                 VALUES (?, ?, 'pending', ?, ?, ?)`,
                [
                    clientId || null,
                    orderType,
                    amount,
                    paymentStatus || 'unpaid',
                    detailsJson ? JSON.stringify(detailsJson) : '{}'
                ]
            );

            return res.status(201).json({
                success: true,
                message: 'Order created successfully',
                orderId: result.id
            });

        } catch (error) {
            console.error('createOrder error:', error);
            return res.status(500).json({ success: false, error: 'Failed to create order' });
        }
    }

    // Update order status, payment status, or details
    async updateOrder(req, res) {
        const { id } = req.params;
        const { status, paymentStatus, detailsJson, amount } = req.body;

        try {
            const order = await db.get('SELECT * FROM crm_orders WHERE id = ?', [id]);
            if (!order) {
                return res.status(404).json({ success: false, error: 'Order not found' });
            }

            const updates = [];
            const params = [];

            if (status) { updates.push('status = ?'); params.push(status); }
            if (paymentStatus) { updates.push('payment_status = ?'); params.push(paymentStatus); }
            if (amount !== undefined) { updates.push('amount = ?'); params.push(amount); }
            if (detailsJson) {
                // Merge details
                const currentDetails = JSON.parse(order.details_json || '{}');
                const mergedDetails = { ...currentDetails, ...detailsJson };
                updates.push('details_json = ?');
                params.push(JSON.stringify(mergedDetails));
            }

            if (updates.length === 0) {
                return res.status(400).json({ success: false, error: 'No fields to update' });
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');
            params.push(id);

            await db.run(
                `UPDATE crm_orders SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            return res.json({ success: true, message: 'Order updated successfully' });

        } catch (error) {
            console.error('updateOrder error:', error);
            return res.status(500).json({ success: false, error: 'Failed to update order' });
        }
    }

    // Update lead status (called by PATCH endpoint)
    async updateLeadStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            await db.run(
                'UPDATE crm_leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [status, id]
            );
            return res.json({ success: true, message: 'Lead status updated successfully' });
        } catch (error) {
            console.error('updateLeadStatus error:', error);
            return res.status(500).json({ success: false, error: 'Failed to update lead status' });
        }
    }
}

module.exports = new CrmController();

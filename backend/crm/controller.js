const db = require('../config/database');

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
        const { name, email, phone, company, source, status, notes } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, error: 'Name and email are required' });
        }

        try {
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
                    notes || null
                ]
            );

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

const db = require('../config/database');

class CareersController {
    // ===== PUBLIC PORTAL ENDPOINTS =====

    // Get active job listings
    async getActiveJobs(req, res) {
        try {
            const jobs = await db.all(
                'SELECT id, title, department, location, employment_type, description, requirements, created_at FROM job_listings WHERE is_active = 1 ORDER BY id DESC'
            );
            return res.json({ success: true, jobs });
        } catch (error) {
            console.error('getActiveJobs error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch job listings' });
        }
    }

    // Submit a job application
    async submitApplication(req, res) {
        const { jobId, name, email, phone, coverLetter, resumeData, resumeName } = req.body;

        if (!jobId || !name || !email || !resumeName) {
            return res.status(400).json({ success: false, error: 'Job ID, name, email, and resume are required' });
        }

        try {
            // Verify job listing exists and is active
            const job = await db.get('SELECT id FROM job_listings WHERE id = ? AND is_active = 1', [jobId]);
            if (!job) {
                return res.status(404).json({ success: false, error: 'Job listing not found or inactive' });
            }

            // Save resume file or path (for simplicity, we'll store local path or base64 metadata)
            const resumePath = `/uploads/resumes/${Date.now()}_${resumeName.replace(/\s+/g, '_')}`;

            // Save to database
            const result = await db.run(
                `INSERT INTO job_applications (job_id, name, email, phone, cover_letter, resume_path, status)
                 VALUES (?, ?, ?, ?, ?, ?, 'applied')`,
                [
                    jobId,
                    name,
                    email,
                    phone || null,
                    coverLetter || null,
                    resumePath
                ]
            );

            return res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                applicationId: result.id
            });

        } catch (error) {
            console.error('submitApplication error:', error);
            return res.status(500).json({ success: false, error: 'Failed to submit application' });
        }
    }

    // ===== ADMIN PORTAL ENDPOINTS =====

    // Get all job listings (including inactive, Admin only)
    async getAllJobs(req, res) {
        try {
            const jobs = await db.all('SELECT * FROM job_listings ORDER BY id DESC');
            return res.json({ success: true, jobs });
        } catch (error) {
            console.error('getAllJobs error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch all job listings' });
        }
    }

    // Create a new job listing (Admin only)
    async createJob(req, res) {
        const { title, department, location, employmentType, description, requirements } = req.body;

        if (!title || !department || !description) {
            return res.status(400).json({ success: false, error: 'Title, department, and description are required' });
        }

        try {
            const result = await db.run(
                `INSERT INTO job_listings (title, department, location, employment_type, description, requirements, is_active)
                 VALUES (?, ?, ?, ?, ?, ?, 1)`,
                [
                    title,
                    department,
                    location || 'Remote',
                    employmentType || 'Full-time',
                    description,
                    requirements || null
                ]
            );

            return res.status(201).json({
                success: true,
                message: 'Job listing created successfully',
                jobId: result.id
            });
        } catch (error) {
            console.error('createJob error:', error);
            return res.status(500).json({ success: false, error: 'Failed to create job listing' });
        }
    }

    // Update job listing (Admin only)
    async updateJob(req, res) {
        const { id } = req.params;
        const { title, department, location, employmentType, description, requirements, isActive } = req.body;

        try {
            const job = await db.get('SELECT * FROM job_listings WHERE id = ?', [id]);
            if (!job) {
                return res.status(404).json({ success: false, error: 'Job listing not found' });
            }

            const updates = [];
            const params = [];

            if (title) { updates.push('title = ?'); params.push(title); }
            if (department) { updates.push('department = ?'); params.push(department); }
            if (location) { updates.push('location = ?'); params.push(location); }
            if (employmentType) { updates.push('employment_type = ?'); params.push(employmentType); }
            if (description) { updates.push('description = ?'); params.push(description); }
            if (requirements) { updates.push('requirements = ?'); params.push(requirements); }
            if (isActive !== undefined) { updates.push('is_active = ?'); params.push(isActive ? 1 : 0); }

            if (updates.length === 0) {
                return res.status(400).json({ success: false, error: 'No fields to update' });
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');
            params.push(id);

            await db.run(
                `UPDATE job_listings SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            return res.json({ success: true, message: 'Job listing updated successfully' });

        } catch (error) {
            console.error('updateJob error:', error);
            return res.status(500).json({ success: false, error: 'Failed to update job listing' });
        }
    }

    // Get list of job applications (Admin/HR only)
    async getApplications(req, res) {
        const { jobId, status } = req.query;
        let query = `
            SELECT a.*, j.title as job_title, j.department 
            FROM job_applications a 
            JOIN job_listings j ON a.job_id = j.id 
            WHERE 1=1
        `;
        const params = [];

        if (jobId) {
            query += ' AND a.job_id = ?';
            params.push(jobId);
        }
        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }

        query += ' ORDER BY a.id DESC';

        try {
            const applications = await db.all(query, params);
            return res.json({ success: true, applications });
        } catch (error) {
            console.error('getApplications error:', error);
            return res.status(500).json({ success: false, error: 'Failed to fetch job applications' });
        }
    }

    // Update application status (Admin/HR only)
    async updateApplicationStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, error: 'Status is required' });
        }

        const validStatuses = ['applied', 'reviewing', 'interviewing', 'offered', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status value' });
        }

        try {
            const application = await db.get('SELECT * FROM job_applications WHERE id = ?', [id]);
            if (!application) {
                return res.status(404).json({ success: false, error: 'Application not found' });
            }

            await db.run(
                'UPDATE job_applications SET status = ? WHERE id = ?',
                [status, id]
            );

            return res.json({ success: true, message: 'Application status updated' });

        } catch (error) {
            console.error('updateApplicationStatus error:', error);
            return res.status(500).json({ success: false, error: 'Failed to update application status' });
        }
    }
}

module.exports = new CareersController();

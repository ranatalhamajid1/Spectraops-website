const db = require('../config/database');

async function initDatabase() {
    try {
        console.log('🔧 Initializing SpectraOps database...');
        await db.initialize();
        
        // Display some stats
        const stats = await db.getContactStats();
        console.log('📊 Database Statistics:');
        console.log(`   - Total contacts: ${stats.total}`);
        console.log(`   - Services available: ${stats.byService.length}`);
        console.log('');
        console.log('✅ Database initialized successfully!');
        console.log('');
        console.log('🔑 Default admin credentials:');
        console.log('   Username: admin');
        console.log('   Password: SpectraOps2025!');
        console.log('   Email: spectraopsofficial@gmail.com');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

initDatabase();
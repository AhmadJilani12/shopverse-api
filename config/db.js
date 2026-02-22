const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // First try the configured MONGO_URI
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 3000,
        });
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (err) {
        console.log('❌ MongoDB Connection Failed:', err.message);
        console.log('⚠️  Local MongoDB not available. Starting in-memory MongoDB...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log(`✅ In-Memory MongoDB running at: ${uri}`);
            console.log('   ⚡ Data will be lost when the server stops.');
        } catch (memErr) {
            console.error('❌ MongoDB Error:', memErr.message);
            process.exit(1);
        }
    }
};

module.exports = connectDB;

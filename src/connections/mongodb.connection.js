const mongoose = require('mongoose');

const serverConfig = require('../config');
const { logger } = require('../utils/logger');

const connectToMongoDB = () => {
    let db = null;

    async function connect() {
        try {
            logger.info('🔗 MongoDB Database Logs');
            await mongoose.connect(serverConfig.MONGODB.URL + serverConfig.MONGODB.NAME);
            db = mongoose.connection;
            db.set('debug', true);
            logger.info('  - MongoDB connection is now open: ' + serverConfig.MONGODB.NAME + ' 🚀');
            return db;
        } catch (error) {
            logger.error('🚨 MongoDB connection error:', error);
            throw error;
        }
    }

    function disconnect() {
        if (!db) {
            mongoose.disconnect();
            logger.info('🛑 MongoDB connection is closed');
        }
    }

    return {
        connect,
        disconnect
    };
}

module.exports = connectToMongoDB;
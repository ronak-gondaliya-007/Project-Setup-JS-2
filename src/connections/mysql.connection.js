const { Sequelize } = require('sequelize');

const serverConfig = require('../config');
const { logger } = require('../utils/logger');

const sequelize = new Sequelize(
    serverConfig.MYSQL.NAME,
    serverConfig.MYSQL.USER,
    serverConfig.MYSQL.PASSWORD,
    {
        host: serverConfig.MYSQL.HOST,
        dialect: 'mysql',
        port: serverConfig.MYSQL.PORT,
        logging: false
    }
);

const connectToMySQL = async () => {
    try {
        await sequelize.authenticate();
        logger.info('🔗 MySQL Database Logs');
        logger.info('  - MySQL Connection established successfully! ✨');

        await sequelize.sync();
        logger.info('  - MySQL Database synchronization complete. ✅');

        return sequelize;
    } catch (error) {
        logger.error('🚨 MySQL connection error:', error);
        process.exit(1);
    }
};

process.on("unhandledRejection", (error) => {
    logger.error("UNHANDLED REJECTION! 💥 Shutting down... 📴");
    logger.error(error.name, error.message);
    process.exit(1);
});

module.exports = { sequelize, connectToMySQL };

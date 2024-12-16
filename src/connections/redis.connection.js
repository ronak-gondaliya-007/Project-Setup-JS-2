const { createClient } = require("redis");

const serverConfig = require('../config');
const { logger } = require("../utils/logger");

var pubClient;
var subClient;

const connectToRedis = async () => {
    try {
        // Redis pub-sub for multiple server message request and response
        const redisConfig = {
            host: serverConfig.REDIS.HOST,
            port: serverConfig.REDIS.PORT,
            password: serverConfig.REDIS.PASSWORD,
            db: serverConfig.REDIS.NUMBER
        };
        logger.info('📶 Redis Logs');

        pubClient = createClient(redisConfig);
        subClient = pubClient.duplicate();

        pubClient.on('connect', () => logger.info('  - Redis pubClient connection initialized successfully. ⚡'));
        pubClient.on('error', (error) => logger.error('🚨 Redis pubClient error:', error));

        subClient.on('connect', () => logger.info('  - Redis subClient connection initialized successfully. ⚡'));
        subClient.on('error', (error) => logger.error('🚨 Redis subClient error:', error));

        // Ensure that the Redis clients are connected before setting up the adapter
        await pubClient.connect()
            .then(() => logger.info('  - Redis pubClient connected successfully. 🔗'))
            .catch((error) => logger.error('🚨 Redis pubClient connection error:', error));
        await subClient.connect()
            .then(() => logger.info('  - Redis subClient connected successfully. 🔗'))
            .catch((error) => logger.error('🚨 Redis subClient connection error:', error));

        return { pubClient, subClient };

    } catch (error) {
        logger.error("🚨 Redis connection error : ", error);
    }
}

module.exports = connectToRedis;
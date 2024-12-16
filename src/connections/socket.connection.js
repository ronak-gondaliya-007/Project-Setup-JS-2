const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const jwt = require("jsonwebtoken");

const serverConfig = require('../config');
const { logger } = require("../utils/logger");

const connectToSocket = async (server, redis) => {
    try {
        logger.info('🌐 Socket Logs');

        io = module.exports = new Server(server, {
            transports: ["websocket", "polling"],
            allowEIO3: true,
            pingTimeout: 10000,
            pingInterval: 10000,
            cors: { origin: "*" }
        });

        redisClient = module.exports = redis.subClient;

        // Redis connection
        io.adapter(createAdapter(redis.subClient, redis.pubClient));

        io.on('connection', (socket) => {
            logger.info(`🚀 Socket connected: ${socket.id}`);

            if (socket.handshake.query.token) {
                try {
                    const decoded = jwt.verify(socket.handshake.query.token, serverConfig.JWT.SECRET);
                    logger.info("Decoded token:", decoded);

                    socket.userObj = decoded;
                } catch (error) {
                    logger.error("⚠️ Token verification failed:", error);
                    socket.disconnect();
                }
            } else {
                logger.error("❌ No token provided. Disconnecting...");
                socket.disconnect();
            }

            socket.on('request', (data) => {
                logger.info(`Event sent ${socket.id}:`, data);
                requestHandler(socket, data);
            });

            socket.on('disconnect', () => {
                logger.info(`Socket disconnected: ${socket.id}`);
                socket.disconnect();
            });
        });

        logger.info(`  - Socket Started on 🖥️  http://localhost:${serverConfig.SERVER.PORT} ✨ \n`);
    } catch (error) {
        logger.error("🚨 Socket connection error : ", error);
    }
}

module.exports = connectToSocket;
// Import required modules
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");

const serverConfig = require("./config");
const { logger } = require("./utils/logger");

const connectToExpress = require("./connections/express.connection");
const { connectToMySQL } = require("./connections/mysql.connection");
const connectToMongoDB = require("./connections/mongodb.connection");
const connectToRedis = require("./connections/redis.connection");
const connectToSocket = require("./connections/socket.connection");

// Configuration
const PORT = serverConfig.SERVER.PORT;
const URL = serverConfig.SERVER.URL;
const ENVIRONMENT = serverConfig.SERVER.ENVIRONMENT;

// Initialize express app and server
const app = express();

let server;
if (serverConfig.SSL.KEY && serverConfig.SSL.CERTIFICATE) {
    server = https.createServer({
        key: fs.readFileSync(serverConfig.SSL.KEY),
        cert: fs.readFileSync(serverConfig.SSL.CERTIFICATE)
    }, app);
} else {
    server = http.createServer(app);
}

// Connect to databases and start the server
async function initializeServer() {
    try {
        logger.info('='.repeat(60));

        // Connect to MySQL
        await connectToMySQL()
            .then(() => {
                logger.info('  - MySQL Database fully operational. 💾 \n');
            })
            .catch((error) => {
                logger.error("🚨 MySQL connection error:", error);
                throw new Error("Failed to connect to MySQL");
            });

        // Connect to MongoDB
        await connectToMongoDB()
            .connect()
            .then(() => {
                logger.info("  - MongoDB connection established successfully. 📂 \n");
            })
            .catch((error) => {
                logger.error("🚨 MongoDB connection error:", error);
                throw new Error("Failed to connect to MongoDB");
            });

        // Connect to Redis
        await connectToRedis()
            .then((redis) => {
                logger.info("  - Redis fully operational. 🗄️ \n");

                // Initialize Socket.io in a separate file
                connectToSocket(server, redis);
            })
            .catch((error) => {
                logger.error("🚨 Redis connection error:", error);
                throw new Error("Failed to connect to Redis");
            });

        // Initialize Express
        await connectToExpress(app)
            .then(() => {
                logger.info("  - Express application initialized successfully! 🛠️");
            })
            .catch((error) => {
                logger.error("🚨 Express initialization error:", error);
                throw new Error("Failed to initialize Express");
            });

        // Start the server
        server.listen(PORT, () => {
            logger.info(`  - Server running on: 🖥️  ${URL} 🎉`);
            logger.info(`  - Environment: ${ENVIRONMENT} 🏠`);
            logger.info('='.repeat(60));
        });
    } catch (error) {
        logger.error('📉 Failed to start server:', error);
        process.exit(1);
    }
}

initializeServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('🔄 SIGTERM received. Shutting down gracefully');

    server.close(() => {
        logger.info('🔄 HTTP server closed');
    });

    try {
        process.exit(0);
    } catch (error) {
        logger.error('🚨 Error during shutdown:', error);
        process.exit(1);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('🚨 Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

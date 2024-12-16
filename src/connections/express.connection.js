const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { logger } = require('../utils/logger');

const connectToExpress = async (app) => {
    try {
        logger.info('🚀 Express Logs');

        app.use(helmet());

        app.use(express.json({ limit: "50mb", type: ["application/json", "text/plain"] }));

        app.use(cors());

        app.use(express.urlencoded({ extended: true }));

        app.use("/health", async (req, res, next) => {
            res.status(200).json({
                statusCode: 200,
                status: '💚 Healthy',
                message: new Date().toISOString()
            });
        });

        process.on("unhandledRejection", (error) => {
            logger.info("UNHANDLED REJECTION! 💥 Shutting down... 📴");
            logger.info(error.name, error.message);
            process.exit(1);
        });

        process.on("uncaughtException", (error) => {
            logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down... 📴");
            logger.error(error.name, error.message);
            process.exit(1);
        });
    } catch (error) {
        logger.error("🚨 Server connection error : ", error);
    }
}

module.exports = connectToExpress;
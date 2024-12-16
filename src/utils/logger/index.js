const fs = require('fs');
const path = require('path');

const serverConfig = require('../../config');

const logLevels = {
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR',
    debug: 'DEBUG',
};

const createLogDir = (logDir) => {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
};

const getTimestamp = () => new Date().toISOString();

const getDailyLogFilePath = (logDir) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    const folderPath = path.join(logDir, currentDate);
    const filePath = path.join(folderPath, `${currentHour}.log`);

    createLogDir(folderPath);

    return filePath;
};

const formatLogMessage = (logObject) => {
    const timestamp = new Date(logObject.timestamp || Date.now()).toISOString().replace('T', ' ').split('.')[0];
    const level = logObject.level || 'INFO';
    const message = logObject.message || '';
    const meta = logObject.meta ? ` | ${JSON.stringify(logObject.meta)}` : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message}${meta}`;
};

const writeLogToFile = (logDir, logObject) => {
    if (logObject.info && logObject.info != '') delete logObject.info;
    const formattedLog = formatLogMessage(logObject);
    const logFilePath = getDailyLogFilePath(logDir);
    fs.appendFileSync(logFilePath, formattedLog + '\n', { encoding: 'utf8' });
};

const log = (level, message, info = "", logDir) => {
    if (!logLevels[level]) {
        throw new Error(`Invalid log level: ${level}`);
    }

    if (info instanceof Error) {
        info = {
            message: info.message,
            stack: info.stack,
        };
    }

    const logObject = {
        timestamp: getTimestamp(),
        level: logLevels[level],
        message,
        info
    };

    const timestamp = logObject.timestamp.replace('T', ' ').slice(0, 19);
    const meta = info && Object.keys(info).length > 0 ? ` | ${JSON.stringify(info)}` : '';
    console.log(`[${timestamp}] [${logObject.level}]: ${logObject.message}${meta}`);

    writeLogToFile(logDir, logObject);
};

// Application log directory
const appLogDir = path.join(process.cwd(), serverConfig.LOGGER.PATH);
createLogDir(appLogDir);

// Cron job log directory
const cronLogDir = path.join(process.cwd(), serverConfig.LOGGER.CRON_PATH);
createLogDir(cronLogDir);

module.exports = {
    logger: {
        info: (message, info) => log('info', message, info, appLogDir),
        warn: (message, info) => log('warn', message, info, appLogDir),
        error: (message, info) => log('error', message, info, appLogDir),
        debug: (message, info) => log('debug', message, info, appLogDir),
    },

    cronLogger: {
        info: (message, info) => log('info', message, info, cronLogDir),
        warn: (message, info) => log('warn', message, info, cronLogDir),
        error: (message, info) => log('error', message, info, cronLogDir),
        debug: (message, info) => log('debug', message, info, cronLogDir),
    },
};

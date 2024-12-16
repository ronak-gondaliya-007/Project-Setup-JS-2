require("dotenv").config();

const serverConfig = {
    SERVER: {
        ENVIRONMENT: String(process.env.ENVIRONMENT),
        PORT: Number(process.env.PORT),
        URL: String(process.env.BASE_URL)
    },
    SSL: {
        KEY: String(process.env.KEY),
        CERTIFICATE: String(process.env.CERTIFICATE),
    },
    MONGODB: {
        URL: String(process.env.MONGODB_URL),
        NAME: String(process.env.MONGODB_NAME)
    },
    MYSQL: {
        HOST: String(process.env.MYSQL_HOST),
        PORT: Number(process.env.MYSQL_PORT),
        NAME: String(process.env.MYSQL_DATABASE),
        USER: String(process.env.MYSQL_USER),
        PASSWORD: String(process.env.MYSQL_PASSWORD)
    },
    REDIS: {
        HOST: String(process.env.REDIS_HOST),
        PORT: Number(process.env.REDIS_PORT),
        PASSWORD: String(process.env.REDIS_PASSWORD),
        NUMBER: String(process.env.REDIS_DB_NO)
    },
    LOGGER: {
        PATH: String(process.env.LOGGER_PATH),
        CRON_PATH: String(process.env.CRON_LOGGER_PATH)
    },
    JWT: {
        SECRET: String(process.env.SECRET_KEY),
        EXPIRATION: String(process.env.EXPIRATION)
    }
};

module.exports = serverConfig;
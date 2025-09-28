import dotenv from 'dotenv'
dotenv.config()

export const SETTINGS = {
    PORT: process.env.PORT || 5001,
    MONGO_URL: process.env.MONGO_URL || process.env.MONGO_URL1,
    DB_NAME: process.env.DB_NAME || 'lesson',
};

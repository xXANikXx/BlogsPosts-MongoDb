import dotenv from 'dotenv'
dotenv.config()

export const SETTINGS = {
    PORT: process.env.PORT || 5001,
    MONGO_URL: process.env.MONGO_URL || "mongodb+srv://nik:nik@lesson.mezyenu.mongodb.net/blogspostsapp?retryWrites=true&w=majority",
    DB_NAME: process.env.DB_NAME || 'blogsPostsApp',
};

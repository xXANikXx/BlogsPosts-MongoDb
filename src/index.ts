import express from "express";
import { setupApp } from "./setup-app";
import {SETTINGS} from "./core/settings/settings";
import {runDB} from "./db/mongo.db";

const bootstrap = async () => {
    const app = express();
    setupApp(app);
    const PORT = SETTINGS.PORT;

    console.log("⏳ Trying to connect to DB...");
    await runDB(SETTINGS.MONGO_URL || "mongodb://localhost:27017/lesson");
    console.log("✅ DB connection success, starting server...");

    app.listen(PORT, () => {
        console.log(`🚀 Example app listening on port ${PORT}`);
    });
    return app;
};

bootstrap()
.then(() => console.log("✅ Bootstrap finished"))
    .catch((err) => {
        console.error("❌ Bootstrap error:", err);
        process.exit(1);
    });
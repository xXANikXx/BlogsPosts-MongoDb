import express from "express";
import { setupApp } from "./setup-app";
import {SETTINGS} from "./core/settings/settings";
import {runDB} from "./db/mongo.db";

const bootstrap = async () => {
    const app = express();
    setupApp(app);
    const PORT = SETTINGS.PORT;

    if (!SETTINGS.MONGO_URL) {
        throw new Error("MONGO_URL is not defined");
    }
    await runDB(SETTINGS.MONGO_URL);

    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
    return app;
};

bootstrap();

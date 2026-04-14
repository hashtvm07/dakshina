"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const config_service_1 = require("../config/config-service");
const firebase_service_1 = require("../core/firebase.service");
const static_home_content_1 = require("../modules/home-content/static-home-content");
async function seed() {
    const config = new config_service_1.ConfigService();
    const firebase = new firebase_service_1.FirebaseService(config);
    firebase.onModuleInit();
    if (!firebase.isAvailable()) {
        throw new Error('Firebase is not configured. Set api/config/firebase-service-account.json or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
    }
    await firebase.set('content/home', static_home_content_1.STATIC_HOME_CONTENT);
    console.log('Seeded content/home in Firebase from static home content.');
}
void seed().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
//# sourceMappingURL=seed-home-content.js.map
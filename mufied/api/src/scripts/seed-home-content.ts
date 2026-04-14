import 'reflect-metadata';
import { ConfigService } from 'src/config/config-service';
import { FirebaseService } from 'src/core/firebase.service';
import { STATIC_HOME_CONTENT } from 'src/modules/home-content/static-home-content';

async function seed() {
  const config = new ConfigService();
  const firebase = new FirebaseService(config);

  firebase.onModuleInit();

  if (!firebase.isAvailable()) {
    throw new Error(
      'Firebase is not configured. Set api/config/firebase-service-account.json or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
    );
  }

  await firebase.set('content/home', STATIC_HOME_CONTENT as unknown as Record<string, unknown>);
  console.log('Seeded content/home in Firebase from static home content.');
}

void seed().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

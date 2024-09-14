/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import functions = require("firebase-functions");

// Access all the environment variables using the 'golfleague' namespace
const apiKey = functions.config().golfleague.api_key;
const authDomain = functions.config().golfleague.auth_domain;
const databaseURL = functions.config().golfleague.database_url;
const projectId = functions.config().golfleague.project_id;
const storageBucket = functions.config().golfleague.storage_bucket;
const messagingSenderId = functions.config().golfleague.messaging_sender_id;
const appId = functions.config().golfleague.app_id;
const measurementId = functions.config().golfleague.measurement_id;

// Example function that uses all these environment variables
exports.getFirebaseConfig = functions.https.onRequest((r:any, rpse:any) => {
  // Sending all the environment variables back in the response
  rpse.json({
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  });
});

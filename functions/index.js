const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
var serviceAccount = require("./assets/service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ng-pwa-push-notification-default-rtdb.firebaseio.com",
});

// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/helloWorld
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

/**
 * IMAGES
 */
const getImages = require("./Images");
exports.getImg = getImages.getImages;

/**
 * MESSAGES
 */
const message = require("./message");
// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/addMessage?text=YOUR-TEXT-MESSAGE
exports.addMessage = message.addMessage;
// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/getAllMessages
exports.getAllMessages = message.getAllMessages;
// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/getMessage?id=ZoMCxkgLfrLJ0ztkI5gq
exports.getMessage = message.getMessage;
// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/deleteMessage?id=ZoMCxkgLfrLJ0ztkI5gq
exports.deleteMessage = message.deleteMessage;

/**
 * USERS
 */
const users = require("./users");

// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/getAllUsers
exports.getAllUsers = users.getUserList;

// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/register
exports.register = users.register;

// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/login
exports.login = users.login;

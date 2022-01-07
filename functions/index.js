const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
var serviceAccount = require("./src/assets/service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ng-pwa-push-notification-default-rtdb.firebaseio.com",
});

// /helloWorld
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

/**
 * IMAGES
 */
const getImages = require("./src/modules/Images");
exports.getImg = getImages.getImages;

/**
 * MESSAGES
 */
const message = require("./src/modules/message");
// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/addMessage?text=YOUR-TEXT-MESSAGE
exports.addMessage = message.addMessage;
exports.getAllMessages = message.getAllMessages;
exports.getMessage = message.getMessage;
exports.deleteMessage = message.deleteMessage;

/**
 * USERS
 */
const users = require("./src/modules/users");

// URL :- http://localhost:5001/ng-pwa-push-notification/us-central1/getAllUsers
exports.getAllUsers = users.getUserList;
exports.register = users.register;
exports.login = users.login;
exports.updateUser = users.updateUser;
exports.deleteUser = users.deleteUser;
exports.getUserById = users.getUserById;    // /getUserById/?id=dsds

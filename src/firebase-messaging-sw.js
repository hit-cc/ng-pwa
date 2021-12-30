// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js")



// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp({
  apiKey: "AIzaSyA808C8YZo7WNsvYfaGlvKCgKdHJEu1NZc",
  authDomain: "ng-pwa-push-notification.firebaseapp.com",
  projectId: "ng-pwa-push-notification",
  storageBucket: "ng-pwa-push-notification.appspot.com",
  messagingSenderId: "818369049302",
  appId: "1:818369049302:web:4b435ece68268f78cfcf77",
  measurementId: "G-VW63432CPN",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

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

messaging.setBackgroundMessageHandler(function (payload) {
  console.log("setBackgroundMessageHandler background message ", payload);

  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return self.registration.showNotification("my notification title");
    });
  return promiseChain;
});

self.addEventListener("push", function (event) {
  console.log("event-->",event);
  var data = event.data.json();
  const title = data.Title;
  data.Data.actions = data.Actions;
  const options = {
    body: data.Message,
    data: data.Data,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {});

self.addEventListener("notificationclose", function (event) {});

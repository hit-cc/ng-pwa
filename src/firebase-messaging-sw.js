// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
self.addEventListener('notificationclick', function (event) {
  console.log("url", redirection_url);
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === redirection_url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(redirection_url);
      }
    })
  );
})

firebase.initializeApp({
  apiKey: "AIzaSyA808C8YZo7WNsvYfaGlvKCgKdHJEu1NZc",
  authDomain: "https://ng-pwa-push-notif.netlify.app",
  projectId: "ng-pwa-push-notification",
  storageBucket: "ng-pwa-push-notification.appspot.com",
  messagingSenderId: "818369049302",
  appId: "1:818369049302:web:4b435ece68268f78cfcf77",
  measurementId: "G-VW63432CPN",
});

const messaging = firebase.messaging()
let redirection_url = ""

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);
  if (Object.keys(payload.fcmOptions).length === 0 && payload?.data?.click_actions) {
    /**
     * NOTE :- key 'click_actions' set from firebase console (Additional option key value);
     * if we send notification from console then set same key
     * */

    redirection_url = payload?.data?.click_actions;
  } else {
    /**
     * NOTE :- when we send notification from api call or with custome data then manage nortification object like belove
     *  "notification": {
        "body": "Test---",
        "title": "New Notification ",
        "click_action": "https://www.angular.io"
        },
     */
    redirection_url = payload?.fcmOptions?.link;
  }
  console.log("redirection_url=>>", redirection_url);
})

const functions = require("firebase-functions");
const admin = require("firebase-admin");


exports.getImages = functions.https.onRequest((req, res) => {
  let storageRef = admin.storage().ref().child("/ngpwa_Images/rose.jpeg");
  storageRef.getDownloadURL().then((url) => console.log(url));
  res.send({
    message: "images list",
    data: storageRef
  });
});

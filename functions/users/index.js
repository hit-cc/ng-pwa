const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const axios = require("axios");
const _collection_name = "users";

exports.getUserList = functions.https.onRequest((req, res) => {
  let user_list = [];
  let final_obj = {};
  try {
    db.collection(_collection_name)
      .get()
      .then(
        (snapshot) => {
          snapshot.forEach((doc) => {
            var obj = {
              id: doc.id,
              displayName: doc.data().displayName,
              email: doc.data().email,
              emailVerified: doc.data().emailVerified,
              photoURL: doc.data().photoURL,
              uid: doc.data().uid,
            };
            user_list.push(obj);
          });

          if (user_list.length && user_list.length > 0) {
            final_obj = {
              status: "success",
              message: "user list",
              total_records: user_list.length,
              data: user_list,
            };
            return;
          } else {
            final_obj = {
              status: "success",
              message: "users not found !",
              total_records: user_list.length,
              data: user_list,
            };
          }
          res.send(final_obj);
          return;
        },
        (error) => {
          res.send({
            status: "error",
            message: error,
          });
          return;
        }
      );
  } catch (error) {
    throw error;
  }
});

exports.register = functions.https.onRequest((req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(400).send("Request method must be post");
      return;
    }
    const email = req.body.email;
    const pass = req.body.password;
    if (email && pass) {
      admin
        .auth()
        .createUser({
          email: email,
          password: pass,
        })
        .then(
          (userRecord) => {
            if (userRecord) {
              res.send({
                id: userRecord.id,
                email: userRecord.email,
                uid: userRecord.uid,
                message:
                  "new user added successfully!, verification link sent to your email.",
              });
              return;
            }
          },
          (error) => {
            res.send({
              status: "error",
              message: error,
            });
            return;
          }
        );
    } else {
      res.send({
        message: "provide email and password",
      });
      return;
    }
  } catch (error) {
    throw error;
  }
});

exports.login = functions.https.onRequest(async (req, res) => {
  try {
    const email = req.body.email;
    const pass = req.body.password;
    const web_api_key = "AIzaSyA808C8YZo7WNsvYfaGlvKCgKdHJEu1NZc";
    const req_endpoint_signUp = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${web_api_key}`;
    const req_body = {
      email: pass,
      password: email,
      returnSecureToken: true,
    };

    console.log("Req.body:::::::::::::::::", req.body);
    console.log("authorize::::::::::::::::", req.headers.authorization);
    if (req.method !== "POST") {
      res.status(400).send("Request method must be post");
      return;
    }

    var options = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
      },
    };
    // +++++++++++++++++++++++++++++++++++++++++++++++++
    // AXIOS PAI CALL

    const response = await axios
      .post(req_endpoint_signUp, req_body, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `${req.headers.authorization}`,
        },
      })
      .then(
        (res) => {
          console.log("REs-----------------------", res);
          return;
        },
        (error) => {
          console.log("Error::::::::::::::::::", error);
          return;
        }
      );

    console.log("++++++++++++++++", response);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    // if (
    //   (!req.headers.authorization ||
    //     !req.headers.authorization.startsWith("Bearer ")) &&
    //   !(req.cookies && req.cookies.__session)
    // ) {
    //   console.error(
    //     "No Firebase ID token was passed as a Bearer token in the Authorization header.",
    //     "Make sure you authorize your request by providing the following HTTP header:",
    //     "Authorization: Bearer <Firebase ID Token>",
    //     'or by passing a "__session" cookie.'
    //   );
    //   res.status(403).send("Unauthorized");
    //   return;
    // }

    // let idToken;
    // if (
    //   req.headers.authorization &&
    //   req.headers.authorization.startsWith("Bearer ")
    // ) {
    //   console.log('Found "Authorization" header');
    //   // Read the ID Token from the Authorization header.
    //   idToken = req.headers.authorization.split("Bearer ")[1];
    // } else if (req.cookies) {
    //   console.log('Found "__session" cookie');
    //   // Read the ID Token from cookie.
    //   idToken = req.cookies.__session;
    // } else {
    //   // No cookie
    //   res.status(403).send("Unauthorized");
    //   return;
    // }
    // try {
    //   const decodeToken = await admin.auth().verifyIdToken(idToken);
    //   console.log("ID Token correctly decoded", decodedIdToken);
    //   req.user = decodedIdToken;
    //   next();
    //   return;
    // } catch (error) {
    //   console.error("Error while verifying Firebase ID token:", error);
    //   res.status(403).send("Unauthorized");
    //   return;
    // }

    // if (email && pass) {
    // functions.https.onRequest(req_endpoint_signUp, req_body).then((res) => {
    //   console.log("Response::", res);
    // });
    // admin
    //   .auth()
    //   .generateSignInWithEmailLink({
    //     email: email,
    //     // password: pass,
    //   })
    //   .then(
    //     (userData) => {
    //       if (userData) {
    //         res.send({
    //           data: userData,
    //         });
    //         console.log("user Data", userData);
    //       }
    //       return;
    //     },
    //     (error) => {
    //       res.send({
    //         status: "error",
    //         message: error,
    //       });
    //       return;
    //     }
    //   );
    // } else {
    //   res.send({
    //     message: "provide email and password",
    //   });
    //   return;
    // }
  } catch (error) {
    throw error;
  }
});

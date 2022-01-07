const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
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
    if (req.method !== "POST") {
      res.status(400).send("Request method must be POST");
      return;
    }

    if (email && pass) {
      admin
        .auth()
        .getUserByEmail(email)
        .then(
          (result) => {
            if (result) {
              getCustomerToken(result);
            }
          },
          (err) => {
            throw err;
          }
        );
    } else {
      res.send({
        message: "provide emnail password",
      });
    }

    async function getCustomerToken(uiddata) {
      if (uiddata) {
        await admin
          .auth()
          .createCustomToken(uiddata.uid)
          .then(
            (result) => {
              res.send({
                status: "success",
                message: "Login Successfully!",
                uid: uiddata.uid,
                token: result,
              });
            },
            (err) => {
              res.send({
                message: "Unable to login ! please try again",
                error: err,
              });
            }
          );
      } else {
        res.send({
          message: "uid data not found !",
        });
      }
    }
  } catch (error) {
    throw error;
  }
});

exports.deleteUser = functions.https.onRequest(async (req, res) => {
  try {
    let _id = req.body.id;
    if (req.method !== "DELETE") {
      res.status(400).send("Request method must be DELETE");
      return;
    }
    if (_id) {
      res.status(200).send({ message: "Api Under Delelopment" });
      return;
    } else {
      res.send({
        error: "Id not found !",
      });
    }
  } catch (error) {
    throw error;
  }
});

exports.updateUser = functions.https.onRequest(async (req, res) => {
  try {
    let _id = req.body.id;
    if (req.method !== "POST") {
      res.status(400).send("Request method must be post");
      return;
    }
    if (_id) {
      res.status(200).send({ message: "Api Under Delelopment" });
      return;
    } else {
      res.send({
        error: "id not found !",
      });
      return;
    }
  } catch (error) {
    throw error;
  }
});

exports.getUserById = functions.https.onRequest(async (req, res) => {
  try {
    let _id = req.query.id;
    if (req.method !== "GET") {
      res.status(400).send("Request method must be GET");
    }
    if (_id) {
      res.status(200).send({ message: "Api Under Delelopment" });
      return;
    } else {
      res.send({
        error: "id not found !",
      });
      return;
    }
  } catch (error) {
    throw error;
  }
});

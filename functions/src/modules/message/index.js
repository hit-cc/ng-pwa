const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();
const _collection_name = "messages"; //collection name
exports.addMessage = functions.https.onRequest(async (req, res) => {
  try {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin
      .firestore()
      .collection(_collection_name)
      .add({ message: original });
    // Send back a message that we've successfully written the message
    if (writeResult.id) {
      res.json({
        status: "success",
        message: "New message added successfully !",
        result: `Message with ID: ${writeResult.id} added.`,
      });
    } else {
      res.json({
        status: "error",
        message: "Opps..! something went wrong.",
      });
    }
  } catch (error) {
    throw error;
  }
});

/**
 * get list of all messages from FIRESTORE DATABSE collection name messages.
 */
exports.getAllMessages = functions.https.onRequest(async (req, res) => {
  try {
    let messages_list = [];
    let final_obj = {};
    db.collection(_collection_name)
      .orderBy("message", "asc")
      .limit(50)
      .get()
      .then(
        (snapshot) => {
          snapshot.forEach((elem) => {
            let obj = {
              id: elem.id,
              message: elem.data().message,
            };
            messages_list.push(obj);
          });

          if (messages_list && messages_list.length > 0) {
            final_obj = {
              status: "success",
              message: "messages list",
              total_records: messages_list.length,
              data: messages_list,
            };
          } else {
            final_obj = {
              status: "success",
              message: "messages not found !",
              total_records: messages_list.length,
              data: messages_list,
            };
          }
          res.send(final_obj);
          return;
        },
        (err) => {
          res.send({
            status: "error",
            message: err,
          });
          return;
        }
      );
  } catch (error) {
    throw error;
  }
});

/**
 * get single message from collection by id
 */

exports.getMessage = functions.https.onRequest((req, res) => {
  try {
    let final_obj = {};
    let doc_id = req.query.id;
    if (req.method !== "POST") {
      res.status(400).send("Request method must be post");
      return;
    }
    if (doc_id) {
      db.collection(_collection_name)
        .doc(doc_id)
        .get()
        .then(
          (snapshot) => {
            if (snapshot.exists) {
              if (snapshot && snapshot.id) {
                final_obj = {
                  status: "success",
                  message: "Message Found.",
                  id: snapshot.id,
                  data: snapshot.data().message,
                };
              } else {
                final_obj = {
                  status: "fail",
                  message: "messages not found !",
                };
              }
              res.send(final_obj);
              return;
            } else {
              final_obj = {
                status: "success",
                message: "No such document!",
              };
              res.send(final_obj);
              return;
            }
          },
          (err) => {
            res.send({
              status: "error",
              message: err,
            });
            return;
          }
        );
    } else {
      res.json({
        message: "id not found in query params",
      });
      return;
    }
  } catch (error) {
    throw error;
  }
});

exports.deleteMessage = functions.https.onRequest((req, res) => {
  try {
    let final_obj = {};
    let doc_id = req.query.id;
    if (req.method !== "POST") {
      res.status(400).send("Request method must be post");
      return;
    }
    if (doc_id) {
      db.collection(_collection_name)
        .doc(doc_id)
        .get()
        .then(
          (snapshot) => {
            if (snapshot.exists) {
              snapshot.ref.delete();
              final_obj = {
                status: "success",
                message: "Document deleted successfully !",
              };
              res.send(final_obj);
            } else {
              final_obj = {
                status: "success",
                message: "No such document found !",
              };
              res.send(final_obj);
            }
          },
          (err) => {
            res.send({
              status: "error",
              message: err,
            });
            return;
          }
        );
    } else {
      res.json({
        message: "id not found",
      });
      return;
    }
  } catch (error) {
    throw error;
  }
});

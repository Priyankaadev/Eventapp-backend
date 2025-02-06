// const commonFunctions = require("../common/common");
const admin = require("firebase-admin");
const path = require("path");
const { service } = require("./firebaseService");

admin.initializeApp({
  credential: admin.credential.cert(service),
});

module.exports = {admin};

module.exports.sendAndroidPushNotificationUsingFCM = async (
  token,
  pushMessage,

) => {
  try {
    if (!token) {
      throw new Error("Device token is required");
    }

    const message = {
      notification: {
        title: pushMessage.title || "Title of your push notification",
        body: pushMessage.body || "Body of your push notification",
      },
      token: token,
    };

    console.log("Sending message:", message);

    const response = await admin.messaging().send(message);
    console.log("Successfully sent notification:", response);

    return {
      success: true,
      response,
    };
  } catch (err) {
    console.error("Message Sending Error:", err);
    throw new Error("Failed to send push notification: " + err.message);
  }
};

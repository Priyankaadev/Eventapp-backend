const { sendAndroidPushNotificationUsingFCM } = require("../../../services/firebase/firebasenotification");

const NotificationSend = async(req, res) =>{
console.log("Hello")
try{
    let pushMessage = {
        title: "KYC Update",
        body: "Hey ! There Please Update Your KYC Details !",
      };
    const res =   await sendAndroidPushNotificationUsingFCM(
        device_id,
        token,
        pushMessage,
    );

      return res.status(200).json("Notification Send Successfully")
}catch(err){
    console.log("err", err)
     res.status(500).json(err)
}
} 

module.exports = {NotificationSend}
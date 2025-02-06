/** 
 * smsService.js
 * @description :: exports function used in sending sms using twilio provider
 */

const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const fast2sms = require("fast-two-sms");
var unirest = require("unirest");

// Twillio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken =  process.env.TWILIO_AUTH_TOKEN
const sendSMS1 = async (obj) => {
    //console.log(obj);
  const client = require('twilio')(accountSid, authToken);
 return client.messages.create({
    from: "+16206759629",
    to: `+91${obj.to}`,
    body: obj.message
  })
  .then((res) => {
    console.log("message has sent")
  })
  .catch((err)=>{
    console.log(err);
  })
};


//fast2sms setup 



const sendSMS = async  (obj) =>{
  var options = {
    authorization : process.env.FAST2SMS_API_KEY , 
    message : obj.message, 
     numbers : [String(obj.to)],
    } 
   const result = await fast2sms.sendMessage(options)
   console.log(result);
  
}




const sendQuickSMS = async (obj) =>{
  var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

  req.query({
    "authorization": process.env.FAST2SMS_API_KEY,
    "language": "english",
    "route": "q",
    "message" : obj.message, 
    "numbers" : [String(obj.to)]
  });
  
  req.headers({
    "cache-control": "no-cache"
  });
  
  
  req.end(function (res) {
    if (res.error) throw new Error(res.error);
  
    console.log(res.body);
  });
  
}

// // send sms by msg91
// const sendOtpService = require('msg91-sdk').SendOtpService;
// const sendOtp = new sendOtpService(process.env.MSG91_AUTH_KEY, "MESSAGE_TEMPLATE");
// const aOptions = {
//   mobile: "918303669251",// (*) mobile number of the client
//   otp: "123456"// (*) OTP received from the client
// }

// const sdk = require('api')('@msg91api/v5.0#171eja12lf0xqafw');
// const sendSmsMsg = () =>{

//   sdk.auth('394999AyjGKG4u643ebce5P1');
//   sdk.sendSms({
//     template_id: '643fbf14d6fc053bfe1faa12',
//     sender: 'techpy',
//     mobiles: '918303669251',
//     name: 'Harsh'
//   })
//     .then(({ data }) => console.log(data))
//     .catch(err => console.error(err));
// }

// var admin = require("firebase-admin");

// var serviceAccount = require("../firebase.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// const messaging = admin.messaging();

//  const sendSmsByFirebase = () =>{
//   const message = {
//     notification: {
//       title: 'Title of your message',
//       body: 'Body of your message',
//     },
//     android: {
//       ttl: 3600 * 1000,
//       priority: 'high',
//       notification: {
//         icon: 'your-icon-url',
//         color: '#f45342',
//       },
//     },
//     apns: {
//       payload: {
//         aps: {
//           badge: 42,
//         },
//       },
//     },
//     to: '+917268911536',
//   };
  
  
  
// admin.messaging().send({
//   notification: {
//     title: 'Title of your message',
//     body: 'Body of your message',
//   },
//   android: {
//     ttl: 3600 * 1000,
//     priority: 'high',
//     notification: {
//       icon: 'your-icon-url',
//       color: '#f45342',
//     },
//   },
//   apns: {
//     payload: {
//       aps: {
//         badge: 42,
//       },
//     },
//   },
//   token:'BJkfXnlegpPPlagIkSps60lPkLbnz4Jf8Dl4AwEc0m8Ks0Kt48HHzQ1NtNWOtHMww0BxF6_XT7lX7RUwUXMHjMA',
//   phone_number : "+917268911536"
// })
// .then((response) => {
//   console.log('Successfully sent message:', response);
// })
// .catch((error) => {
//   console.log('Error sending message:', error);
// });

// }




module.exports = { sendSMS,sendQuickSMS}; 
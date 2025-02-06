const nodemailer = require('nodemailer');
const SibApiV3Sdk = require("sib-api-v3-sdk")
const ejs = require('ejs');
const sesTransport = require('nodemailer-ses-transport');
const dotenv = require('dotenv');
dotenv.config({path:".env"});


// Nodemailer Setup for send email
const AWSCredentials = {
  accessKeyId: process.env.AWS_SES_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  region: process.env.AWS_SES_REGION
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASSWORD
    }
});

const sendMailByNodemailer =  async (obj) => {
  if (!Array.isArray(obj.to)) {
    obj.to = [obj.to];
  }

  let htmlText = '';
  if (obj.template){
    htmlText = await ejs.renderFile(`${__basedir}${obj.template}/html.ejs`, {data:obj.data || null});
  }

  let mailOpts = {
    from: obj.from || process.env.COMPANY_EMAIL,
    subject: obj.subject || 'Sample Subject',
    to: obj.to,
    cc: obj.cc || [],
    bcc: obj.bcc || [],
    html: htmlText,
    attachments: obj.attachments || []
  };
  return transporter.sendMail(mailOpts, (err,info)=>{
    if(err){
        console.log(err);
        return ;
    }
    console.log(info.response);
  });
};


// SendInBlue Setup to send email
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'] ;
apiKey.apiKey = process.env.SIB_API_KEY;
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendMail =  async (obj) => {

  let htmlText = '';
  if (obj.template){
    htmlText = await ejs.renderFile(`${__basedir}${obj.template}/html.ejs`, {data:obj.data || null});
  }

  const sender ={
    email:process.env.COMPANY_EMAIL,
    name:process.env.COMPANY_NAME
  }
  
  const receivers = [
    {
      email: obj.to
    }
  ]

  return tranEmailApi.sendTransacEmail({
    sender,
    to:receivers,
    subject: "Welcome To Event app",
    htmlContent: htmlText
  }).then(console.log).catch(console.log)


};

module.exports = { sendMail };

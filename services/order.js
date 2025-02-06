const dayjs = require("dayjs");
const emailService = require("./email");
const smsService = require("./sms");

/**
  * @description :  send Welcome via SMS By Register.
  * @param {string} user : user document.
  * @return {boolean}  : returns status whether SMS is sent or not.
  */
const sendOrderConfirmBySMS = async (user) => {
    try {
        const msg = await ejs.renderFile(`${__basedir}/views/sms/order/orderConfirm/html.ejs`, { data:{user:user} });
        let smsObj = {
            to: user.phone,
            message: msg
        };
        await smsService.sendQuickSMS(smsObj);
        return true;
    } catch (error) {
        return false;
    }
};


/**
  * @description :  send Welcome via SMS By Register.
  * @param {string} user : user document.
  * @return {boolean}  : returns status whether Email is sent or not.
  */

const sendOrderConfirmByEmail = async (user) => {
    try {
       
        let mailObj = {
            subject: 'Order confirmed | Thank you for placing your order!',
            to: user.email,
            template: '/views/email/order/orderConfirm',   
            data: {
                isWidth: true,
                user: user || '-',
                message: "Thank you for your purchase!"
            }
        };
        try {
            await emailService.sendMail(mailObj);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {
    sendOrderConfirmByEmail,
    sendOrderConfirmBySMS
}
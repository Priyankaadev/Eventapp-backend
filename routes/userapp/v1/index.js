/** 
* index.js
* @description :: index route file for userapp platform
*/

const express = require("express");
const router = express.Router();

router.use('/userapp/auth', require("./auth"));
router.use('/userapp/user',require('./userRoutes'));
router.use('/userapp/event',require('./eventRoutes'));
router.use('/userapp/committee',require('./committeeRoutes'));
router.use('/userapp/eventinfo',require('./eventinfoRoutes'));
router.use('/userapp/delegate',require('./delegateRoutes'));
router.use('/userapp/eventfeed',require('./eventfeedRoutes'));
router.use('/userapp/download',require('./downloadRoutes'));
router.use('/userapp/docs',require('./docsRoutes'));
router.use('/userapp/exhibitor',require('./exhibitorRoutes'));
router.use('/userapp/feedback',require('./feedbackRoutes'));
router.use('/userapp/polls',require('./pollsRoutes'));
router.use('/userapp/quiz',require('./quizRoutes'));
router.use('/userapp/quizresponse',require('./quizresponse'));
router.use('/userapp/review',require('./reviewRoutes'));
router.use('/userapp/speaker',require('./speakerRoutes'));
router.use('/userapp/agenda',require('./agendaRoutes'));
router.use('/userapp/meeting',require('./meetingRoutes'));
router.use('/userapp/message',require('./messageRoutes'));
router.use('/userapp/email',require('./emailRoutes'));
router.use('/userapp/session',require('./sessionRoutes'));
router.use('/userapp/feedbackform',require('./feedbackformRoutes'));
router.use('/userapp/pollresponse',require('./pollresponse'));
router.use('/userapp/askquestion',require('./askquestionRoutes'));
router.use('/userapp/qanda',require('./qandaRoutes'));
router.use('/userapp/reply',require('./replyRoutes'));
router.use('/userapp/feedbackresponse',require('./feedbackresponseRoutes'));
router.use('/userapp/contact',require('./contactRoutes'));
router.use('/userapp/notification', require("./notificationRoutes"))
router.use('/userapp/leadscan', require("./leadscanRoutes"))
router.use('/userapp/quiztext', require("./quiztextRoutes"))
router.use('/userapp/quicklink', require("./quicklinkRoutes"))
router.use('/userapp/slider', require("./sliderRoutes"))

module.exports = router;
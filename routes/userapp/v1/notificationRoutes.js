const express = require("express");
const router = express.Router();
// const leadscanController = require("../../../controller/userapp/v1/leadscanController");
// const {PLATFORM} = require("../../../constants/authConstant");
const notificationController = require("../../../controller/userapp/v1/notificationController")
// const auth = require("../../../middleware/auth");/


router.post('/send',notificationController?.NotificationSend);

module.exports = router;


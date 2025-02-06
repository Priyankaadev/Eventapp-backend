const express = require("express");
const router = express.Router();
const meetingController = require("../../../controller/userapp/v1/meetingController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), meetingController.addMeeting);
router.post('/list', meetingController.findAllMeeting);
router.get('/get/:id', meetingController.getMeeting);
router.post('/count',meetingController.getMeetingCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), meetingController.updateMeeting);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), meetingController.deleteMeeting)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), meetingController.softDeleteMeeting)

module.exports = router;



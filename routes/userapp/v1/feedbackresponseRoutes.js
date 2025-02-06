const express = require("express");
const router = express.Router();
const feedbackresponseController = require("../../../controller/userapp/v1/feedbackresponseController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), feedbackresponseController.addFeedbackresponse);
router.post('/list', feedbackresponseController.findAllFeedbackresponse);
router.get('/get/:id', feedbackresponseController.getFeedbackresponse);
router.post('/count',feedbackresponseController.getFeedbackresponseCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), feedbackresponseController.updateFeedbackresponse);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), feedbackresponseController.deleteFeedbackresponse)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), feedbackresponseController.softDeleteFeedbackresponse)

module.exports = router;



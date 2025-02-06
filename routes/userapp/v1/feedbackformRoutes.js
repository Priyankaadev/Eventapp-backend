const express = require("express");
const router = express.Router();
const feedbackformController = require("../../../controller/userapp/v1/feedbackformController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), feedbackformController.addFeedbackform);
router.post('/list', feedbackformController.findAllFeedbackform);
router.get('/get/:id', feedbackformController.getFeedbackform);
router.post('/count',feedbackformController.getFeedbackformCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), feedbackformController.updateFeedbackform);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), feedbackformController.deleteFeedbackform)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), feedbackformController.softDeleteFeedbackform)

module.exports = router;



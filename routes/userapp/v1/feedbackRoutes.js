const express = require("express");
const router = express.Router();
const feedbackController = require("../../../controller/userapp/v1/feedbackController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), feedbackController.addFeedback);
router.post('/list', feedbackController.findAllFeedback);
router.get('/get/:id', feedbackController.getFeedback);
router.post('/count',feedbackController.getFeedbackCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), feedbackController.updateFeedback);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), feedbackController.deleteFeedback)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), feedbackController.softDeleteFeedback)

module.exports = router;



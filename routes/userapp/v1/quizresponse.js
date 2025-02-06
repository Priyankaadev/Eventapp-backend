const express = require("express");
const router = express.Router();
const quizresponseController = require("../../../controller/userapp/v1/quizresponseController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), quizresponseController.addQuizresponse);
router.post('/list', quizresponseController.findAllQuizresponse);
router.get('/get/:id', quizresponseController.getQuizresponse);
router.post('/count',quizresponseController.getQuizresponseCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), quizresponseController.updateQuizresponse);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), quizresponseController.deleteQuizresponse)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), quizresponseController.softDeleteQuizresponse)

module.exports = router;



const express = require("express");
const router = express.Router();
const quizController = require("../../../controller/userapp/v1/quizController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), quizController.addQuiz);
router.post('/list', quizController.findAllQuiz);
router.get('/get/:id', quizController.getQuiz);
router.post('/count',quizController.getQuizCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), quizController.updateQuiz);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), quizController.deleteQuiz)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), quizController.softDeleteQuiz)

module.exports = router;



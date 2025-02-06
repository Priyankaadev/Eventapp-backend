const express = require("express");
const router = express.Router();
const quiztextController = require("../../../controller/userapp/v1/quiztextController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), quiztextController.addQuiztext);
router.post('/list', quiztextController.findAllQuiztext);
router.get('/get/:id', quiztextController.getQuiztext);
router.post('/count',quiztextController.getQuiztextCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), quiztextController.updateQuiztext);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), quiztextController.deleteQuiztext)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), quiztextController.softDeleteQuiztext)

module.exports = router;



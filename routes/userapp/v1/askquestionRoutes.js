const express = require("express");
const router = express.Router();
const askquestionController = require("../../../controller/userapp/v1/askquestionController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), askquestionController.addAskquestion);
router.post('/list', askquestionController.findAllAskquestion);
router.get('/get/:id', askquestionController.getAskquestion);
router.post('/count',askquestionController.getAskquestionCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), askquestionController.updateAskquestion);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), askquestionController.deleteAskquestion)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), askquestionController.softDeleteAskquestion)
module.exports = router;



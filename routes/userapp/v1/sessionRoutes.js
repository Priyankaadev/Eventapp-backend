const express = require("express");
const router = express.Router();
const sessionController = require("../../../controller/userapp/v1/sessionController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), sessionController.addSession);
router.post('/list', sessionController.findAllSession);
router.get('/get/:id', sessionController.getSession);
router.post('/count',sessionController.getSessionCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), sessionController.updateSession);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), sessionController.deleteSession)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), sessionController.softDeleteSession)

module.exports = router;



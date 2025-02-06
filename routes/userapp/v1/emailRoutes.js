const express = require("express");
const router = express.Router();
const emailController = require("../../../controller/userapp/v1/emailController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), emailController.addEmail);
router.post('/list', emailController.findAllEmail);
router.get('/get/:id', emailController.getEmail);
router.post('/count',emailController.getEmailCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), emailController.updateEmail);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), emailController.deleteEmail)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), emailController.softDeleteEmail)

module.exports = router;



const express = require("express");
const router = express.Router();
const contactController = require("../../../controller/userapp/v1/contactController")
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), contactController.addContact);
router.post('/list', contactController.findAllContact);
router.get('/get/:id', contactController.getContact);
router.post('/count',contactController.getContactCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), contactController.updateContact);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), contactController.deleteContact)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), contactController.softDeleteContact)

module.exports = router;



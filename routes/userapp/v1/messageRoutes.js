const express = require("express");
const router = express.Router();
const messageController = require("../../../controller/userapp/v1/messageController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), messageController.addMessage);
router.post('/list', messageController.findAllMessage);
router.get('/get/:id', messageController.getMessage);
router.post('/count',messageController.getMessageCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), messageController.updateMessage);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), messageController.deleteMessage)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), messageController.softDeleteMessage)
module.exports = router;



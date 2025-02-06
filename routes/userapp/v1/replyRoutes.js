const express = require("express");
const router = express.Router();
const replyController = require("../../../controller/userapp/v1/replyController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), replyController.addReply);
router.post('/list', replyController.findAllReply);
router.get('/get/:id', replyController.getReply);
router.post('/count',replyController.getReplyCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), replyController.updateReply);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), replyController.deleteReply)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), replyController.softDeleteReply)
module.exports = router;



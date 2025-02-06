const express = require("express");
const router = express.Router();
const eventinfoController = require("../../../controller/userapp/v1/eventinfoController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), eventinfoController.addEventinfo);
router.post('/list', eventinfoController.findAllEventinfo);
router.get('/get/:id', eventinfoController.getEventinfo);
router.post('/count',eventinfoController.getEventinfoCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), eventinfoController.updateEventinfo);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), eventinfoController.deleteEventinfo)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), eventinfoController.softDeleteEventinfo)

module.exports = router;



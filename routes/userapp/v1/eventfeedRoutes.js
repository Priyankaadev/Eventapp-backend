const express = require("express");
const router = express.Router();
const eventfeedController = require("../../../controller/userapp/v1/eventfeedController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), eventfeedController.addEventfeed);
router.post('/list', eventfeedController.findAllEventfeed);
router.get('/get/:id', eventfeedController.getEventfeed);
router.post('/count',eventfeedController.getEventfeedCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), eventfeedController.updateEventfeed);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), eventfeedController.deleteEventfeed)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), eventfeedController.softDeleteEventfeed)

module.exports = router;



const express = require("express");
const router = express.Router();
const eventController = require("../../../controller/userapp/v1/eventController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), eventController.addEvent);
router.post('/list', eventController.findAllEvent);
router.get('/get/:id', eventController.getEvent);
router.post('/count',eventController.getEventCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), eventController.updateEvent);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), eventController.deleteEvent)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), eventController.softDeleteEvent)

module.exports = router;



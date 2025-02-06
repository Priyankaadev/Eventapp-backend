const express = require("express");
const router = express.Router();
const pollresponseController = require("../../../controller/userapp/v1/pollresponseController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), pollresponseController.addPollresponse);
router.post('/list', pollresponseController.findAllPollresponse);
router.get('/get/:id', pollresponseController.getPollresponse);
router.post('/count',pollresponseController.getPollresponseCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), pollresponseController.updatePollresponse);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), pollresponseController.deletePollresponse)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), pollresponseController.softDeletePollresponse)
module.exports = router;



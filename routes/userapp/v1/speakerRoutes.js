const express = require("express");
const router = express.Router();
const speakerController = require("../../../controller/userapp/v1/speakerController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), speakerController.addSpeaker);
router.post('/list', speakerController.findAllSpeaker);
router.get('/get/:id', speakerController.getSpeaker);
router.post('/count',speakerController.getSpeakerCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), speakerController.updateSpeaker);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), speakerController.deleteSpeaker)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), speakerController.softDeleteSpeaker)

module.exports = router;



const express = require("express");
const router = express.Router();
const committeeController = require("../../../controller/userapp/v1/committeeController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), committeeController.addCommittee);
router.post('/list', committeeController.findAllCommittee);
router.get('/get/:id', committeeController.getCommittee);
router.post('/count',committeeController.getCommitteeCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), committeeController.updateCommittee);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), committeeController.deleteCommittee)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), committeeController.softDeleteCommittee)

module.exports = router;



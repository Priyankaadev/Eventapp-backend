const express = require("express");
const router = express.Router();
const leadscanController = require("../../../controller/userapp/v1/leadscanController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), leadscanController.addLeadscan);
router.post('/list',auth(PLATFORM.USERAPP), leadscanController.findAllLeadscan);
router.get('/get/:id', leadscanController.getLeadscan);
router.post('/count',leadscanController.getLeadscanCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), leadscanController.updateLeadscan);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), leadscanController.deleteLeadscan)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), leadscanController.softDeleteLeadscan)

module.exports = router;



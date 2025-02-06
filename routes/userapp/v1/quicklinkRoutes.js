const express = require("express");
const router = express.Router();
const quicklinkController = require("../../../controller/userapp/v1/quicklinkController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), quicklinkController.addQuicklink);
router.post('/list', quicklinkController.findAllQuicklink);
router.get('/get/:id', quicklinkController.getQuicklink);
router.post('/count',quicklinkController.getQuicklinkCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), quicklinkController.updateQuicklink);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), quicklinkController.deleteQuicklink)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), quicklinkController.softDeleteQuicklink)

module.exports = router;



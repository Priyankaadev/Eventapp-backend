const express = require("express");
const router = express.Router();
const downloadController = require("../../../controller/userapp/v1/downloadController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), downloadController.addDownload);
router.post('/list', downloadController.findAllDownload);
router.get('/get/:id', downloadController.getDownload);
router.post('/count',downloadController.getDownloadCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), downloadController.updateDownload);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), downloadController.deleteDownload)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), downloadController.softDeleteDownload)

module.exports = router;



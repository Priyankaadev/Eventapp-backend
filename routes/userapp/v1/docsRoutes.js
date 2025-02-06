const express = require("express");
const router = express.Router();
const docsController = require("../../../controller/userapp/v1/docsController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), docsController.addDocs);
router.post('/list', docsController.findAllDocs);
router.get('/get/:id', docsController.getDocs);
router.post('/count',docsController.getDocsCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), docsController.updateDocs);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), docsController.deleteDocs)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), docsController.softDeleteDocs)

module.exports = router;



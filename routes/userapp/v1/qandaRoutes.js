const express = require("express");
const router = express.Router();
const qandaController = require("../../../controller/userapp/v1/qandaController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), qandaController.addQanda);
router.post('/list', qandaController.findAllQanda);
// findAllQandaWithReplies
router.post('/quandalist', qandaController.findAllQandaWithReplies);
router.get('/get/:id', qandaController.getQanda);
router.post('/count',qandaController.getQandaCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), qandaController.updateQanda);
router.put('/like/:id',auth(PLATFORM.USERAPP), qandaController.toggleLike);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), qandaController.deleteQanda)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), qandaController.softDeleteQanda)
module.exports = router;



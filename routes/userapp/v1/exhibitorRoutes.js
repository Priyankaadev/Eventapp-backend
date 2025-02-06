const express = require("express");
const router = express.Router();
const exhibitorController = require("../../../controller/userapp/v1/exhibitorController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), exhibitorController.addExhibitor);
router.post('/list',auth(PLATFORM.USERAPP), exhibitorController.findAllExhibitor);
router.get('/get/:id', exhibitorController.getExhibitor);
router.post('/count',exhibitorController.getExhibitorCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), exhibitorController.updateExhibitor);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), exhibitorController.deleteExhibitor)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), exhibitorController.softDeleteExhibitor)

module.exports = router;



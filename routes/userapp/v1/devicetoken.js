const express = require("express");
const router = express.Router();
const devicetokenController = require("../../../controller/userapp/v1/devicetokenController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), devicetokenController.addDevicetoken);
router.post('/list', devicetokenController.findAllDevicetoken);
router.get('/get/:id', devicetokenController.getDevicetoken);
router.post('/count',devicetokenController.getDevicetokenCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), devicetokenController.updateDevicetoken);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), devicetokenController.deleteDevicetoken)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), devicetokenController.softDeleteDevicetoken)
router.post('/bulkinsert', auth(PLATFORM.USERAPP), devicetokenController.bulkInsertDevicetoken)
module.exports = router;



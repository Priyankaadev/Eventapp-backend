const express = require("express");
const router = express.Router();
const delegateController = require("../../../controller/userapp/v1/delegateController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), delegateController.addDelegate);
router.post('/list', delegateController.findAllDelegate);
router.get('/get/:id', delegateController.getDelegate);
router.post('/count',delegateController.getDelegateCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), delegateController.updateDelegate);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), delegateController.deleteDelegate)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), delegateController.softDeleteDelegate)
router.post('/bulkinsert', auth(PLATFORM.USERAPP), delegateController.bulkInsertDelegate)
module.exports = router;



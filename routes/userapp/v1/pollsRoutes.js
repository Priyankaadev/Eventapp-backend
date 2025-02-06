const express = require("express");
const router = express.Router();
const pollsController = require("../../../controller/userapp/v1/pollsController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), pollsController.addPolls);
router.post('/list', pollsController.findAllPolls);
router.get('/get/:id', pollsController.getPolls);
router.post('/count',pollsController.getPollsCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), pollsController.updatePolls);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), pollsController.deletePolls)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), pollsController.softDeletePolls)

module.exports = router;



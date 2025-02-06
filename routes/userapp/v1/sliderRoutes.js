const express = require("express");
const router = express.Router();
const sliderController = require("../../../controller/userapp/v1/sliderController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), sliderController.addSlider);
router.post('/list', sliderController.findAllSlider);
router.get('/get/:id', sliderController.getSlider);
router.post('/count',sliderController.getSliderCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), sliderController.updateSlider);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), sliderController.deleteSlider)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), sliderController.softDeleteSlider)

module.exports = router;



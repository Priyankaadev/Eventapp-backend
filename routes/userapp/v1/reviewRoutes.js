const express = require("express");
const router = express.Router();
const reviewController = require("../../../controller/userapp/v1/reviewController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), reviewController.addReview);
router.post('/list', reviewController.findAllReview);
router.get('/get/:id', reviewController.getReview);
router.post('/count',reviewController.getReviewCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), reviewController.updateReview);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), reviewController.deleteReview)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), reviewController.softDeleteReview)

module.exports = router;



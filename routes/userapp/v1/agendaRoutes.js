const express = require("express");
const router = express.Router();
const agendaController = require("../../../controller/userapp/v1/agendaController");
const {PLATFORM} = require("../../../constants/authConstant");
const auth = require("../../../middleware/auth");

router.post('/create',auth(PLATFORM.USERAPP), agendaController.addAgenda);
router.post('/list', agendaController.findAllAgenda);
router.get('/get/:id', agendaController.getAgenda);
router.post('/count',agendaController.getAgendaCount);
router.put('/update/:id',auth(PLATFORM.USERAPP), agendaController.updateAgenda);
router.delete('/delete/:id', auth(PLATFORM.USERAPP), agendaController.deleteAgenda)
router.put('/softdelete/:id', auth(PLATFORM.USERAPP), agendaController.softDeleteAgenda)

module.exports = router;



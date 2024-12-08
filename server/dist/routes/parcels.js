"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ParcelController_1 = require("../controllers/ParcelController");
const auth_guard_1 = require("../guards/auth.guard");
const router = (0, express_1.Router)();
const parcelController = new ParcelController_1.ParcelController();
router.post('/', auth_guard_1.authenticateToken, (req, res) => parcelController.createParcel(req, res));
router.put('/:id', auth_guard_1.authenticateToken, (req, res) => parcelController.updateParcel(req, res));
router.get('/:id', auth_guard_1.authenticateToken, (req, res) => parcelController.getParcel(req, res));
router.get('/user/:user_id', auth_guard_1.authenticateToken, (req, res) => parcelController.getUserParcels(req, res));
router.patch('/:id/status', auth_guard_1.authenticateToken, (req, res) => parcelController.updateParcelStatus(req, res));
exports.default = router;
//# sourceMappingURL=parcels.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/profile', (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
});
router.put('/profile', (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
});
router.get('/', (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map
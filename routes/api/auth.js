const express = require('express');
const router = express.Router();
const { schemas } = require('../../models/users');
const validateBody = require('../../middlewares/validateBody');
const authenticate = require('../../middlewares/authenticate')
const ctrl = require('../../controllers/auth');

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);
router.post('/login', validateBody(schemas.loginSchema), ctrl.login);
router.post('/logout', authenticate, ctrl.logout);
router.get('/current', authenticate, ctrl.current);
router.patch('/', authenticate, ctrl.changeSubscription);

module.exports = router;
const express = require('express');
const router = express.Router();
const { schemas } = require('../../models/users');
const validateBody = require('../../middlewares/validateBody');
const authenticate = require('../../middlewares/authenticate')
const ctrl = require('../../controllers/auth');
const upload = require('../../middlewares/upload')

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);
router.post('/login', validateBody(schemas.loginSchema), ctrl.login);
router.post('/logout', authenticate, ctrl.logout);
router.get('/current', authenticate, ctrl.current);
router.patch('/', authenticate, ctrl.changeSubscription);
router.patch('/avatars',upload.single('avatar'), authenticate, ctrl.changeAvatar);
router.get('/verify/:verificationToken', ctrl.userVerificationToken);
router.post('/verify', ctrl.userVerification);

module.exports = router;
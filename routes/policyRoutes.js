const express = require('express');
const policyController = require('./../controllers/policyController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);
//router.use(authController.checkPolicy);

router.route('/policy').post(policyController.addPolicy);
router.route('/permission').post(policyController.addPermissionForUser);

module.exports = router;

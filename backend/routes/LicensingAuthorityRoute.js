const express = require("express");

const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
    createLicensingAuthority,
    LicensingAuthorityLogin,
    LicensingAuthorityDashboard,
    LANotificationpost,
    LANotificationSendingStartups,
    LA_NotificationGet
} = require("../controllers/licensingAuthorityController");

const router = express.Router();

//registration for liscensingAuthority
router.route("/licensingAuthority-reg").post(asyncMiddleware(createLicensingAuthority));

//Login for liscensingAuthority
router.route("/authority-login").post(asyncMiddleware(LicensingAuthorityLogin));

//Dashboard for liscensingAuthority
router.route("/licensingAuthority-dashboard").post(asyncMiddleware(LicensingAuthorityDashboard));

//Dashboard for LA-Notificationpost
router.route("/LA-Notificationpost").post(asyncMiddleware(LANotificationpost));

//Dashboard for LA-NotificationSendingStartups
router.route("/LA-NotificationSendingStartups").post(asyncMiddleware(LANotificationSendingStartups));

//Dashboard for LA-NotificationGet
router.route("/LA-NotificationGet").post(asyncMiddleware(LA_NotificationGet));
module.exports = router;
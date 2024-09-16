const express = require("express");

const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
    createLiscensingAuthority,
    LiscensingAuthorityLogin,
    LiscensingAuthorityDashboard,
    LANotificationpost,
    LANotificationSendingStartups,
    LA_NotificationGet
} = require("../controllers/liscensingAuthorityController");

const router = express.Router();

//registration for liscensingAuthority
router.route("/liscensingAuthority-reg").post(asyncMiddleware(createLiscensingAuthority));

//Login for liscensingAuthority
router.route("/liscensingAuthority-login").post(asyncMiddleware(LiscensingAuthorityLogin));

//Dashboard for liscensingAuthority
router.route("/liscensingAuthority-dashboard").post(asyncMiddleware(LiscensingAuthorityDashboard));

//Dashboard for LA-Notificationpost
router.route("/LA-Notificationpost").post(asyncMiddleware(LANotificationpost));

//Dashboard for LA-NotificationSendingStartups
router.route("/LA-NotificationSendingStartups").post(asyncMiddleware(LANotificationSendingStartups));

//Dashboard for LA-NotificationGet
router.route("/LA-NotificationGet").post(asyncMiddleware(LA_NotificationGet));
module.exports = router;
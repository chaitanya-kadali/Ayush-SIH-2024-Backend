const express = require("express");

const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
    drugInspectorLogin,
    DrugInspectorDashboard,
    DINotificationpost,
    DINotificationSendingStartups,
    DI_NotificationGet
} = require("../controllers/drugInspectorController");

const router = express.Router();

//Login for drugInspector
router.route("/drugInspector-login").post(asyncMiddleware(drugInspectorLogin));

//Dashboard for drugInspector
router.route("/drugInspector-dashboard").post(asyncMiddleware(DrugInspectorDashboard));

//Dashboard for I-Notificationpos
router.route("/DI-Notificationpost").post(asyncMiddleware(DINotificationpost));

//Dashboard for DI-NotificationSendingStartups
router.route("/DI-NotificationSendingStartups").post(asyncMiddleware(DINotificationSendingStartups));

//Dashboard for DI-NotificationSendingStartups
router.route("/DI-NotificationGet").post(asyncMiddleware(DI_NotificationGet));
module.exports = router;
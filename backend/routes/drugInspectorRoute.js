const express = require("express");

const asyncMiddleware = require('../middleware/catchAsyncErrors');
const {
    createDrugInspector,
    drugInspectorLogin,
    DrugInspectorDashboard,
    DINotificationpost,
    DINotificationSendingStartups,
    DI_NotificationGet
} = require("../controllers/drugInspectorController");

const router = express.Router();

//registration for DrugInspector
router.route("/drugInspector-reg").post(asyncMiddleware(createDrugInspector));

//Login for drugInspector
router.route("/drugInspector-login").post(asyncMiddleware(drugInspectorLogin));

//Dashboard for drugInspector
router.route("/drugInspector-dashboard").post(asyncMiddleware(DrugInspectorDashboard));

//Dashboard for I-Notificationpost
router.route("/DI-Notificationpost").post(asyncMiddleware(DINotificationpost));

//Dashboard for DI-NotificationSendingStartups
router.route("/DI-NotificationSendingStartups").post(asyncMiddleware(DINotificationSendingStartups));

//Dashboard for DI-NotificationGet
router.route("/DI-NotificationGet").post(asyncMiddleware(DI_NotificationGet));
module.exports = router;
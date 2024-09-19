const express = require("express");
const router = express.Router();

const authenticateJWT=require("../middleware/authMiddleware");  //validate the Token after login

// token verify route
router.route("/tokenverify").post(authenticateJWT); 

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt =require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;
 
// Middleware
app.use(cors());
app.use(bodyParser.json());


// Server
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
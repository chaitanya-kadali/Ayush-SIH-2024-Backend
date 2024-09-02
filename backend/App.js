const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose=require('mongoose');
require('dotenv').config(); // to access the values .env file

const app = express();
 
// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/aayushdb');

// farmer reg and all here
  const farmer = require("./routes/farmerRoute");
  const doctor = require("./routes/doctorRoute");
  const startup = require("./routes/startUpRoute");
  const drugInspector = require("./routes/drugInspectorRoute");
app.use("/api",drugInspector);
app.use("/api",farmer);

const chat = require("./routes/chatRoute");
app.use("/api",chat);
 
app.use("/api",doctor);
app.use("/api",startup);


app.listen(process.env.PORT, () =>{ 
console.log(`Server is running on port ${process.env.PORT}`);
});
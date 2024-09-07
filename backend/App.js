const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose=require('mongoose');
// require('dotenv').config(); // to access the values .env file
const PORT=5002;
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

// importings of persons
  const farmer = require("./routes/farmerRoute");
  const doctor = require("./routes/doctorRoute");
  const startup = require("./routes/startUpRoute");
  const drugInspector = require("./routes/drugInspectorRoute");

// importing apis
  const chat = require("./routes/chatRoute");
  const district = require("./routes/districtRoute")
  const sendEmail  = require("./routes/sendEmailRoute")

// assigning the persons
  app.use("/api",drugInspector);
  app.use("/api",farmer);
  app.use("/api",doctor);
  app.use("/api",startup);

// assigning the apis
app.use("/api",chat);
app.use("/api",district);
app.use("/api",sendEmail);


app.listen(process.env.PORT , () =>{ 
console.log(`Server is running on port ${process.env.PORT}`);
});
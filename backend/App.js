const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose=require('mongoose');
// require('dotenv').config(); // to access the values .env file
// const PORT=5002;
require('dotenv').config(); // to access the values .env file

const app = express();
 
// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas Connection
const mongoUri = "mongodb+srv://aayushdb:Ayush123@cluster0.dbb2fbo.mongodb.net/aayushdb?retryWrites=true&w=majority&appName=Cluster0;"

if (!mongoUri) {
    console.error('MongoDB URI not defined in .env file.');
    process.exit(1);
}

mongoose.connect(mongoUri)
.then(() => {
    console.log('Connected to MongoDB Atlas!');
})
.catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

// importings of persons
  const farmer = require("./routes/farmerRoute");
  const doctor = require("./routes/doctorRoute");
  const startup = require("./routes/startUpRoute");
  const drugInspector = require("./routes/drugInspectorRoute");

// importing apis
  const chat = require("./routes/chatRoute");
  const district = require("./routes/districtRoute")
  const sendEmail = require("./routes/sendEmailRoute")

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
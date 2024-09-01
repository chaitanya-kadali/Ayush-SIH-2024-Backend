const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT=3000;
const mongoose=require('mongoose');



const app = express();
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
app.use("/api",doctor);
app.use("/api",startup);
app.use("/api/dashboard",farmer);
app.use("/api/dashboard",doctor);
app.use("/api/dashboard",startup);
app.use("/api/dashboard",drugInspector);

app.listen(PORT, () =>{ 
console.log(`Server is running on port ${PORT}`);
});
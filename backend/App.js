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
mongoose.connect('mongodb://localhost:27017/');
  
// farmer reg and all here
  const farmer = require("./routes/farmerRoute");
app.use("/api",farmer);


app.listen(PORT, () =>{ 
console.log(`Server is running on port ${PORT}`);
});
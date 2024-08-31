const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
 
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  

  //Doctor model
  const Doctor=mongoose.Schema({
    name:String,
    Email_ID:String,
    password:String,
    district:String,
    state:String,
    phone_number:Number,
    language:String          // storing time= 0702
  });
  
  const doctor=mongoose.model("doctor",Doctor);

// farmer reg and all here
  const farmer = require("./routes/farmerRoute");
app.use("/api",farmer);

// registration for Doctor
app.post('/doctor-inf', async (req, res) => {
  const info= req.body;
  
  try {
    // Hash the password
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(info.password, saltRounds);

    // Create new user instance with hashed password
    const Doctor = new doctor(info);

    // Save the user to the databas
    await Doctor.save();

    res.status(201).json(Doctor);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
});



app.listen(PORT, () =>{ 
console.log(`Server is running on port ${PORT}`);
});
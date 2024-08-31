const Farmer = require("../models/farmerModel"); // object of farmer collection
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // by default error catcher

exports.createFarmer = catchAsyncErrors( async (req, res) => {
  const info= req.body;
  
  try {
    // Hash the password
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(info.password, saltRounds);

    // Create new user instance with hashed password
    const Farmer = new farmer(info);

    // Save the user to the databas
    await Farmer.save();

    res.status(201).json(Farmer);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
});
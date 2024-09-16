const Joi=require('joi');

//Doctor schema validator
const Doctorschema = Joi.object({
    name: Joi.string().min(3).required(),   // Name must be a string, at least 3 characters long
    Email_ID: Joi.string().email().required(),  // Email must be a valid email format
    password: Joi.string().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,30}$')).required(),
  // Password with alphanumeric characters
    district: Joi.string().required(),   // District is a required string
    state: Joi.string().required(),      // State is a required string
    phone_number: Joi.number().integer().min(1000000000).max(9999999999).required(),  // Phone number as a 10-digit integer
    language: Joi.string().optional()    // Language is optional
  });

  //LiscensingAuthority schema validator
  const LicensingAuthorityschema = Joi.object({
    name: Joi.string().min(3).required(),   // Name must be a string, at least 3 characters long
    Email_ID: Joi.string().email().required(),  // Email must be a valid email format
    password: Joi.string().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,30}$')).required(),
 // Password with alphanumeric characters
    mobile_no: Joi.number().integer().min(1000000000).max(9999999999).required(),  // Mobile number as a 10-digit integer
    designation: Joi.string().required(),  // Designation is a required string
    Qualification: Joi.string().required(),  // Qualification is a required string
    OrderReferenceNo: Joi.number().required(),  // Order reference number is a required string
    OrderDate: Joi.date().required(),  // Order date must be a valid date
    State: Joi.string().required(),  // State is a required string
    district: Joi.string().required()  // District is a required string
  });

//Farmer schema validator
  const Farmerschema = Joi.object({
    name: Joi.string().min(3).required(),
    phone_number: Joi.number().integer().min(1000000000).max(9999999999).required(),
    password: Joi.string().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,30}$')).required(),
    district: Joi.string().required(),
    state: Joi.string().required(),
    crop_name: Joi.string().required(),
    language: Joi.string().optional()
  });

//Startup schema validator
const Startupschema = Joi.object({
    Email_ID: Joi.string().email().required(),  // Email must be a valid email format
    password: Joi.string().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,30}$')).required(),
  // Password with alphanumeric characters, min 8 characters
    companyName: Joi.string().min(2).required(),  // Company name must be a string, at least 3 characters long
    address: Joi.string().required(),  // Address must be a string and is required
    city: Joi.string().required(),  // City must be a string and is required
    pinCode: Joi.number().integer().min(100000).max(999999).required(),  // Pin code as a 6-digit integer
    state: Joi.string().required(),  // State must be a string and is required
    district: Joi.string().required(),  // District must be a string and is required
    phone_number: Joi.number().integer().min(1000000000).max(9999999999).required()  // Phone number as a 10-digit integer
  });

  //Druginspector schema validator
const Druginspectorschema = Joi.object({
  name: Joi.string().min(3).required(),   // Name must be a string, at least 3 characters long
  Email_ID: Joi.string().email().required(),  // Email must be a valid email format
  password: Joi.string().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,30}$')).required(),
  // Password with alphanumeric characters
  district: Joi.string().required(),   // District is a required string
  state: Joi.string().required(),      // State is a required string
  phone_number: Joi.number().integer().min(1000000000).max(9999999999).required(),  // Phone number as a 10-digit integer
  language: Joi.string().optional()    // Language is optional
});



  module.exports = { Doctorschema, LicensingAuthorityschema, Farmerschema, Startupschema,Druginspectorschema };

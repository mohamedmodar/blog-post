const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi =require("joi");
//user schema
 const UserSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        //to delete spaces after and before the name
        trim : true,
        minlength :2,
        maxlength: 100
    },
    email:{
        type : String,
        required : true,
        trim : true,
        minlength :5,
        maxlength: 100,
        unique : true
    },
    password: {
        type : String,
        required : true,
        trim : true,
        minlength :8,
    },
    profilePicture :{
        type: Object,
        url: "https://woodfibreinsulation.co.uk/wp-content/uploads/2017/04/blank-profile-picture-973460-1-1-768x768.png",
        publicId : null
    },
    //Because it have a one attribute
    bio :{
        type: String
    },
    gender :{
        type: String
    },
    isAdmin:{
       type:Boolean,
       default: false
    },
    isAcountVerified:{
        type:Boolean,
        default: false
     }
 },{
    // ti add created at
    timestamps: true
 });

 //generate auth token
UserSchema.methods.generateAuthToken = function(){
return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET, 
  { expiresIn: "30d"} 
    )
}

 //user model
 const User = mongoose.model("User",UserSchema);

 //validate of register user 

  function validateRigesterUser (obj){
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),
        bio: joi.string(),
        profilePicture: joi.object()

    });

    return schema.validate(obj);

  }

  //validate login user 
  
  function validateLoginUser (obj){
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),

    });
    return schema.validate(obj);

  }
    //validate update user 
  
    function validateUpdateUser (obj){
        const schema = joi.object({
            username: joi.string().trim().min(2).max(100).required(),
            password: joi.string().trim().min(8).required(),
    
        });
        return schema.validate(obj);
    
      }
 module.exports= {
    User,
    validateRigesterUser,
    validateLoginUser,
    validateUpdateUser
 }
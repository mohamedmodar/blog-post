const asyncHandler = require("express-async-handler");
const {User, validateUpdateUser} = require("../models/user")
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const {cloudinaryRemoveImage,cloudinaryUploadImage}= require("../utils/cloudinary");
/**--------------------------
 * @desc get all users profiles
 * @router /api/users/profile
 * @method get
 * @access private (only admin)
 ---------------------------*/
 module.exports.getAllUsersCtrl = asyncHandler(async(req,res)=>{
      //select -password to hide it
    const users = await User.find().select("-password");
    res.status(200).json(users);
 });

 /**--------------------------
 * @desc get user profiles
 * @router /api/user/profile/:id
 * @method get
 * @access public
 ---------------------------*/
 module.exports.getUserProfileCtrl = asyncHandler(async(req,res)=>{
   //select -password to hide it
    const user = await User.findById(req.params.id).select("-password");
    if(!user){
      return res.status(404).json({message : "user not found" });
    }
    res.status(200).json(user);
 });

  /**--------------------------
 * @desc update user
 * @router /api/user/profile/:id
 * @method PUT
 * @access pivate (user himself)
 ---------------------------*/
 module.exports.updateUserProfileCtrl = asyncHandler(async(req,res)=>{
   const {error} = validateUpdateUser(req.body);
   if (error){
      return res.status(400).jsonp({message: error.details[0].message})
   }
   if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      req.body.password =  await bcrypt.hash(req.body.password,salt);
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id,{
         $set:{
            username: req.body.username,
            password:req.body.password,
         }
      },{ new: true }).select("-password");
      res.status(200).json(updatedUser);
 });

 /**--------------------------
 * @desc get users counts
 * @router /api/users/count
 * @method get
 * @access private (only admin)
 ---------------------------*/
 module.exports.getUsersCountCtrl = asyncHandler(async(req,res)=>{
   //select -password to hide it
 const count = await User.count();
 res.status(200).json(count);
});
/**--------------------------
 * @desc profile photo upload
 * @router /api/users/profile-photo-upload
 * @method post
 * @access private (only loggedIn user)
 ---------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async(req,res)=>{
   //1. Validation
if(!req.file){
   return res.status(400).json({message: "no file provided"})
}  
// 2.get the path to the image.
const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
// 3.upload to cloudinary.
const result = await cloudinaryUploadImage(imagePath);
console.log(result);
// 4. get the user from DB.
const user = await User.findById(req.user.id);
// 5. delete old profile photo if exist.
if(user.profilePicture.publicId !== null) {
   await cloudinaryRemoveImage(user.profilePicture.publicId)
}
// 6.change the profile field in db.

user.profilePicture = {
   url: result.secure_url,
   publicId: result.public_id,
}
await user.save();
//7.send response to client.
 res.status(200).json({
   message : "your profile photo uploaded succesfully",
  profilePicture:{url: result.secure_url, publicId: result.public_id}
});

//8. remove image from server.
fs.unlinkSync(imagePath); 

})
/**--------------------------
 * @desc delet user profiles (account)
 * @router /api/users/profile/:id
 * @method delete
 * @access private (only admin OR user himself)
 ---------------------------*/

 module.exports.deleteUserProfileCtrl = asyncHandler(async(req,res) =>{
// 1.get the user form DB
const user = await User.findById(req.params.id);
if(!user){
   return res.status(404).json({message: "user not found"});
}
// 2. @TODO get all posts from DB
// 3. @TODO GET THE PUBLIC iD FROM THE POSTS
// 4. @TODO delet all posts image form cloudinary that belong to user
// 5. delete profile picture of user
await cloudinaryRemoveImage(user.profilePicture.publicId);
// 6. @TODO delete user posts & comments
// 7. delete the user himself
await User.findByIdAndDelete(req.params.id);
// 8. send a response to the client
 res.status(200).json({message: "profile delted suucesfully "})
 });

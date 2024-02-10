const asyncHandler = require("express-async-handler");
const {User, validateUpdateUser} = require("../models/user")
const bcrypt = require("bcryptjs");
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
 * @desc delet user profiles (account)
 * @router /api/users/profile/:id
 * @method delete
 * @access private (only admin OR user himself)
 ---------------------------*/

 module.exports.deleteUserProfileCtrl = asyncHandler(async(req,res) =>{
// 1.get the user form DB
//2. get all posts from DB
//3. GET THE PUBLIC iD FROM THE POSTS
//4. delet all posts imag
 });

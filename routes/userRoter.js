const router = require("express").Router();
const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl, profilePhotoUploadCtrl, deleteUserProfileCtrl } = require("../controller/userController");
const { verfiyTokenAndAdmin, verfiyTokenAndOnlyUser, verfiyToken, verfiyTokenAndAuthorization } = require("../middlewares/verfityToken");
const validateObjectid = require("../middlewares/validateObjectid");
const photoUpload = require("../middlewares/photoUpload");

// /api/users/profiles

//if user was admin the middle ware will access to get all users
router.route("/profiles")
.get ( verfiyTokenAndAdmin ,getAllUsersCtrl);

 
// /api/users/profiles/:id
router.route("/profiles/:id")
.get (validateObjectid, getUserProfileCtrl)
.put(validateObjectid,verfiyTokenAndOnlyUser, updateUserProfileCtrl)
.delete(validateObjectid,verfiyTokenAndAuthorization, deleteUserProfileCtrl);

// /api/users/profile-photo-upload
router.route("/profiles/profile-photo-upload")
.post ( verfiyToken,photoUpload.single("image"),profilePhotoUploadCtrl);

// /api/users/count
router.route("/count")
.get ( verfiyTokenAndAdmin ,getUsersCountCtrl);

//

module.exports = router;
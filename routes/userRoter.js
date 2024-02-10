const router = require("express").Router();
const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl } = require("../controller/userController");
const { verfiyTokenAndAdmin, verfiyTokenAndOnlyUser } = require("../middlewares/verfityToken");
const validateObjectid = require("../middlewares/validateObjectid");

// /api/users/profiles

//if user was admin the middle ware will access to get all users
router.route("/profiles")
.get ( verfiyTokenAndAdmin ,getAllUsersCtrl);

 
// /api/users/profiles/:id
router.route("/profiles/:id")
.get (validateObjectid, getUserProfileCtrl)
.put(validateObjectid,verfiyTokenAndOnlyUser, updateUserProfileCtrl);

// /api/users/count
router.route("/count")
.get ( verfiyTokenAndAdmin ,getUsersCountCtrl);

module.exports = router;
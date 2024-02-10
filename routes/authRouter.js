const router = require("express").Router();
const express = require("express");
const app = express();
//middle ware.
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

const {registerUserCtrl, loginUserCtrl}= require("../controller/authController");

//  api/auth/register
router.post("/register", registerUserCtrl);


//  api/auth/login
router.post("/login", loginUserCtrl);

module.exports = router;

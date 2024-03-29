const mongoose = require("mongoose");
const joi = require("joi");

//post schema

const postSchema = new mongoose.Schema({
title:{
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 200
},
title:{
    type: String,
    required: true,
    trim: true,
    minlength: 10,
},
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
category:{
    type: String,
    required: true,
},
image:{
    type: object,
    default: {
        url: "",
        publicId: null, 
    }
},
likes:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
]
})
const jwt = require("jsonwebtoken");

//verfiy token

function verfiyToken(req,res,next){
    const authToken = req.headers.authorization
    if(authToken){
        const Token = authToken.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(Token, process.env.JWT_SECRET) ;
            req.user = decodedPayload;
            next();
        } catch (error) {
            return res.status(401).json({message :  " invalid token , access denind"})

        }
    }

    else{
        return res.status(401).json({message : "no token provide , access denind"})
    }
};

// VERFIY tOKEN and admin 

function verfiyTokenAndAdmin(req,res,next){
    verfiyToken(req,res, ()=>{
        if(req.user.isAdmin){
            next();
        }
        else{
               //403 means you have no access as a user
      return res.status(403).json({message : "not allowed, only admin "})
        }
    })
}
// VERFIY tOKEN and user 

function verfiyTokenAndOnlyUser(req,res,next){
    verfiyToken(req,res, ()=>{
        if(req.user.id = req.params.id){
            next();
        }
        else{
               //403 means you have no access as a user
      return res.status(403).json({message : "not allowed, only user himself "})
        }
    })
}
//verfit token and authorization
// VERFIY tOKEN and user or admin

function verfiyTokenAndAuthorization(req,res,next){
    verfiyToken(req,res, ()=>{
        if(req.user.id = req.params.id || req.user.isAdmin){
            next();
        }
        else{
               //403 means you have no access as a user
      return res.status(403).json({message : "not allowed, only user himself or admin"})
        }
    })
}
module.exports = {verfiyToken,
                    verfiyTokenAndAdmin ,
                     verfiyTokenAndOnlyUser, 
                    verfiyTokenAndAuthorization};


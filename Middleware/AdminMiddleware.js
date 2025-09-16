const jwt = require('jsonwebtoken');
const tokenKey=process.env.JWT_SECRET_ADMIN;
 module.exports=async (req,resp,next)=>{
//  try {
// const JWTtoken  =req.headers['authorization'].split(" ")[1]
// jwt.verify(JWTtoken,tokenKey,(err,success)=>{
//     if(err){
//         return resp.status(401).send({
//             success:false,
//             message:'un-authorize user'
//         })
//     } else {
//         req.body.id=success.id;
//         next();
//     }
// })
    
//  } catch (error) {
//     console.log(error)
//     resp.status(500).send({
//         success:false,
//         message:'token is not provide',
//         error
//     })
//  }
try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return resp.status(401).send({
        success: false,
        message: 'Token not provided',
      });
    }

    const JWTtoken = authHeader.split(' ')[1];

    jwt.verify(JWTtoken, tokenKey, (err, decoded) => {
      if (err) {
        return resp.status(401).send({
          success: false,
          message: 'Unauthorized user',
        });
      }

      // ✅ Store user data in req.user instead of req.body
      req.user = decoded;
      console.log( "user=>",req.user)

      next();
    });

  } catch (error) {
    console.error(error);
    resp.status(500).send({
      success: false,
      message: 'Error verifying token',
      error,
    });
  }
 }
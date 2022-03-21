
var express = require('express');
var router = express.Router();
var {mongodb,MongoClient,dbUrl} =  require('../dbSchema')
var {hashPassword,hashCompare,createToken,verifyToken,verifyAdminRole} = require('../auth');


router.post('/signup',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    let db = await client.db("video_app");
    let user = await db.collection('users').find({email:req.body.email})
   
    if(user)
    {
        res.json({
statusCode:400,
          message:"User Already Exists"
        })
    }
    else
    {
        let hashedPassword = await hashPassword(req.body.password);
        req.body.password = hashedPassword
        let user = await db.collection('users').insertOne(req.body);
        res.json({
          statusCode:200,
          message:"User SignUp Successfull"
        })
    }
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error"
    })
  }
  finally{
    client.close()
  }
})


router.post('/login',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    let db = await client.db("video_app");
    let user = await db.collection('users').findOne({email:req.body.email})
    if(user)
    {
        let compare = await hashCompare(req.body.password,user.password);
        if(compare)
        {
          let token  = await createToken(user.email,user.firstName,user.role)
          res.json({
              statusCode:200,
              role:user.role,
              email:user.email,
              firstName:user.firstName,
              token
            })
        }
        else{
          res.json({
            statusCode:400,
            message:"Invalid Password"
          })
        }
    }
    else{
      res.json({
        statusCode:404,
        message:"User Not Found"
      })
    }
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error"
    })
  }
  finally{
    client.close()
  }
})


router.post('/auth',verifyToken,/*verifyAdminRole,*/ async(req,res)=>{
  res.json({
    statusCode:200,
    message:req.body.purpose
  })
})


router.post("/add_video", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("video_app");

    let document = await db.collection("video_url").insertOne(req.body);
    res.json({
      statusCode: 201,
      message: "Data Added",
      data: document,
    });
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal server Error",
    });
  } finally {
    client.close();
  }
});

router.get("/video_url", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db("video_app");
    let users = await db.collection("video_url").find().toArray();
    console.log(users);
    res.json({
      statusCode: 200,
      users,
    });
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "Internal server Error",
    });
  } finally {
    client.close();
  }
});



module.exports = router;

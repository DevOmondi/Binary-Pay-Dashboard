//require installed packages

const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const salt = 10;

//require User model
const User = require("./models/userModel");

   const app = express();
   require("dotenv").config();

   //middlewares
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cookieParser());
   
   //Get environment variables and explicitly declare variables
const port = process.env.PORT || 3000;
const db = process.env.MONGODB_URI || "mongodb://localhost/binarypay";
const JWT_SECRET = process.env.jwt;

//start server
app.listen(port,()=> {
    console.log(`Server is running on port : ${port}`)
})

//connect to database
mongoose.connect(db,
    {
       
        useNewUrlParser:true,
        useUnifiedTopology:true,
        
    },
    (err) =>{
        err
           ? console.log(`There was an error: ${err.message}`)
           : console.log("Connected successfully to database!!")
    });

//maintain connection to the database
mongoose.connection;

//signUp api
app.post("/signUp",async (req,res)=>{
    //capturing input from the user
    const {username,password:plainTextPassword}= req.body;

    //encrypting the password to store it in the database
    const password = await bcrypt.hash(plainTextPassword,salt);

       try{
           //storing user in our database
           const response = await User.create({
               username,
               password
           })
           return res.json(console.log("User created"));
       } 
       catch(error){
         console.log(JSON.stringify(error));
         if(error.code === 11000){
             return res.send({status:'error',error:"username already exists"})
         }
         throw error
       }
})

//logIn function
const verifyUserLogin = async (username,password) =>{
    try{
        const user = await User.findOne({username}).lean()
        if(!user){
            return {status:'error',error:'user not found'}
        }

        if (await bcrypt.compare(password,user.password)){
            //creating a JWT token
            token = jwt.sign({id:user._id,username:user.username,type: 'user'},JWT_SECRET,{expiresIn: '2h'})
            return {status: 'ok',data:token}
        }
        return {status:'error',error:'invalid password :('}
    }
    catch(error){
        console.log(error);
        return{status:'error', error:'time out :('}
    }
}

//logIn api
app.post("/logIn", async (req,res) =>{
    const {username,password} = req.body;

    //use logIn function
    const response = await verifyUserLogin(username,password);
    if(response.status === 'ok'){
        //storing our JWT token as a cookie in our web browser
        res.cookie('token',token,{maxAge:2*60*60*1000, httpOnly:true}) //maxAge set to 2hrs
        res.redirect('/');
    }
    else{
        res.json(response);
    }

})

const verifyToken = (token) =>{
    try{
        const verify = jwt.verify(token,JWT_SECRET);
        if(verify.type === 'user'){
            return true;
        }
        else{
            return false;
        };
    }
    catch(error){
        console.log(JSON.stringify(error),"error");
        return false;
    }
}

//get requests
app.get('/',(req,res)=>{
    const {token} = req.cookies;
    if(verifyToken(token)){
        return res.render('');
    }
    else{
        res.redirect('/logIn')
    }
})
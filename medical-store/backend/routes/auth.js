const express = require('express');
const Users = require('../models/Users');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const fetchAdmin=require('../middleware/fetchAdmin')
const Admins = require('../models/Admins');
const JWT_SECRET = 'S@FBG/LH&H';

//Route #01 to create a Signup of New User

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Enter a Password').isLength({ min: 8 }),
], async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
    }
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({ error: "Sorry, A user with this email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await Users.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id,
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route #02: Authenticate a user using Login method
router.post('/login',[
    body('email','Enter valid email address').isEmail(),
    body('password','Enter an Exact Password').exists()
],async(req,res)=>{
    let success=false;
    const error=validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({error:"Please login using valid credentials"});
    }
    const {email,password}=req.body;
    try {
        let user=await Users.findOne({email});
        if(!user){
            success=false;
            res.status(400).json({error:"Plaese login using a valid credentials"});
        }
        const comPass=await bcrypt.compare(password,user.password);
        if(!comPass){
            success = false;
            res.status(400).json({error:"Plaese login using a valid credentials"});
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
});

//Route# 03: Register as an admin to use Admin Panel
router.post('/createadmin', [
    body('name', 'Enter a valid admin name').isLength({ min: 3 }),
    body('email', 'Enter a valid email address for admin panel').isEmail(),
    body('password', 'Enter a Strong Password for your Admin Panel').isLength({ min: 8 }),
], async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
    }
    try {
        let admin=await Admins.findOne({email:req.body.email});
        if (admin) {
            res.status(400).json({ error: "Sorry, A user with this email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const realPass = await bcrypt.hash(req.body.password, salt);

        admin = await Admins.create({
            name: req.body.name,
            email: req.body.email,
            password: realPass,
        })
        const data = {
            admin: {
                id:admin.id,
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route# 04: Login as an admin in the Admin Panel
router.post('/adminlogin',[
    body('email','Enter valid email address for admin panel').isEmail(),
    body('password','Enter an Exact Password for admin panel').exists()
],async(req,res)=>{
    let success=false;
    const error=validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({error:"Please login using valid credentials"});
    }
    const {email,password}=req.body;
    try {
        let admin=await Admins.findOne({email});
        if(!admin){
            success=false;
            res.status(400).json({error:"Plaese login using a valid credentials"});
        }
        const comPass=await bcrypt.compare(password,admin.password);
        if(!comPass){
            success = false;
            res.status(400).json({error:"Plaese login using a valid credentials"});
        }
        const data={
            admin:{
                id:admin.id,
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
});

//Route# 05: Fetch User specific details
router.get('/getuser',fetchUser,async(req,res)=>{
    try {
        const userId=req.user.id;
        const user=await Users.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
//Route# 05: Fetch Admin specific details
router.get('/getadmin',fetchAdmin,async(req,res)=>{
    try {
        const adminId=req.admin.id;
        const admin=await Admins.findById(adminId).select('-password');
        res.send(admin);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
const route = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Refresh_token = require('../models/refresh');
const ForgotPassword = require('../models/forgot-password');
const mail = require('../mail');
const crypto = require('crypto');

route.get('/', (req, res)=>{
    res.render('index.ejs');
});

route.get('/not-found', (req, res)=>{
    res.render('not-found.ejs'); 
});

route.get('/login', (req, res)=>{
    res.render('login.ejs', {error: "Login into nirvana."});
});

route.get('/register', (req, res)=>{
    res.render('register.ejs', {error: "Are you ready?", username: "", password: "", email: "", roll_no: "", year: "", college: "NIT Jalandhar"});
});

route.post('/login', async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) return res.render('login.ejs', {error: "All fields are required!"});
    try{
        const currUser = await User.findOne({email});
        if(!currUser) return res.render('login.ejs', {error: "User not found!"});
        else if(await bcrypt.compare(password, currUser.password)){
            //Start the login and authorization process
            const accessToken = jwt.sign({username: currUser.username}, process.env.ACCESS_TOKEN_SECRET, {algorithm: "HS256", expiresIn: '1m'});
            const refresh_token = jwt.sign({username: currUser.username}, process.env.REFRESH_TOKEN_SECRET, {algorithm: "HS256", expiresIn: '30d'});
            res.cookie('dontseethis', accessToken, {path: '/', httpOnly: true, secure: false,  sameSite: 'strict'}).cookie('icantseeyou', refresh_token, {path: '/', httpOnly: true, secure: false, sameSite: 'strict'}).redirect('/user/dashboard');
            let newRefreshToken = new Refresh_token({token: refresh_token});
            newRefreshToken.save().then(()=>console.log('Refresh token saved successfully')).catch((err)=>console.log('Error saving refresh token'));
        } else{
            res.render('login.ejs', {error: "Incorrect username or password!"});
        } 
    } catch(err){
        console.log("Error during validating user. Error: "+err);
    }
});

route.post('/register', async (req, res)=>{
    const {username, email, college, year, roll_no, password} = req.body;
    console.log(username+"\n"+email+"\n"+year+"\n"+roll_no+"\n"+password);
    if(!username || !email || !college || !year || !roll_no || !password)
        return res.render('register.ejs', {error: "All fields are required", username, password, email, roll_no, year, college});
    if(password.length < 6) return res.render('register.ejs', {error: "Password at least 6 characters long.", username, password, email, roll_no, year, college});
    if(year<1 || year>4) return res.render('register.ejs', {error: "Are you sure that year is possible?", username, password, email, roll_no, year, college});
    if(roll_no.length !== 8) return res.render('register.ejs', {error: "Ambiguous Roll Number detected.", username, password, email, roll_no, year, college});
    try{
        const userSearch = await User.findOne({username: username});
        const emailSearch = await User.findOne({email: email});
        const hashedPassword = await bcrypt.hash(password, 10);
        if(userSearch) return res.render('register.ejs', {error: "Username taken.", username, password, email, roll_no, year, college});
        if(emailSearch) return res.render('register.ejs', {error: "Email already registered!", username, password, email, roll_no, year, college});
        //If all the provided input is of correct type
        const newUser = new User({username, email, password: hashedPassword, email, roll_no, year, college});
        newUser.save().then((newuserreg)=>{res.redirect('/login') ;console.log("User saved"); mail.welome(email);}).catch((err)=>console.log("Error while saving. Error: "+err)); 
    } catch(err){
        res.status(500).redirect('/');
        console.log("Error while checking data in database. Error: "+err);
    }
});

route.get('/forgot-password', (req, res)=>{
    res.render('forgot-password.ejs', {error: 'Can you do a brute force here and hack into someone\'s account?'});
});

route.post('/forgot-password', async (req, res)=>{
    const {email} = req.body;
    if(!email) return res.render('forgot-password.ejs', {error: 'Please enter a valid email'});
    try{
        const user = await User.findOne({email});
        if(!user) return res.render('forgot-password.ejs', {error: 'User not found. Keep trying :)'});
        const findIfALinkExist = await ForgotPassword.findOne({email});
        if(findIfALinkExist) return res.render('forgot-password.ejs', {error: 'Already send a link.'});
        const link = crypto.randomBytes(16).toString('hex');
        const createAResetLink = new ForgotPassword({email, link});
        await createAResetLink.save();
        //mail.forgotPassword(email, link);
        res.render('forgot-password.ejs', {error: "An email has been send."});
    } catch(err){
        console.log("Error while reset password. Error: "+err);
        res.status(500).redirect('/');
    }
});

module.exports = route;
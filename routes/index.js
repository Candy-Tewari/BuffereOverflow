const route = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')

route.get('/', (req, res)=>{
    res.render('index.ejs');
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
        if(await bcrypt.compare(password, currUser.password)){
            res.render('login.ejs', {error: "You are logged in!"});
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
        newUser.save().then((newuserreg)=>{res.redirect('/login') ;console.log("User saved")}).catch((err)=>console.log("Error while saving. Error: "+err)); 
    } catch(err){
        res.status(500).redirect('/');
        console.log("Error while checking data in database. Error: "+err);
    }
});

module.exports = route;
const route = require('express').Router();
const jwt = require('jsonwebtoken');
const Refresh_token = require('../models/refresh');
const Parcel = require('../models/parcel');
const User = require('../models/user');

function authenticateToken(req, res, next){
    if(typeof req.cookies === 'undefined' || typeof req.cookies.dontseethis === 'undefined' || typeof req.cookies.icantseeyou === 'undefined'){
        console.log("Redirected to login");
        req.verification = false; next(); return;
    }
    let accessToken = req.cookies.dontseethis;
    let refreshToken = req.cookies.icantseeyou;
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, access_token_decoded) =>{
        if(err){ //Access token is incorrect or malformed or expired 
            //If the refresh token is correct, we will give a new access token and entry to the user
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, refresh_token_decoded)=>{
                if(err){
                    req.verification = false; 
                    next();
                    return; 
                } else{
                    //Generate a new access token and send it to the client
                    const currentUser = await User.findOne({username: refresh_token_decoded.username});
                    console.log(currentUser);
                    console.log(currentUser.username);
                    const new_access_token = jwt.sign({username: currentUser.username, rating: currentUser.rating, verified: currentUser.verified}, process.env.ACCESS_TOKEN_SECRET, {algorithm: 'HS256', expiresIn: '1m'});
                    res.cookie('dontseethis', new_access_token, {secure: false, httpOnly: true, path: '/', sameSite: true});
                    req.verification = true; 
                    req.username = refresh_token_decoded.username;
                    req.rating = currentUser.rating;
                    req.verified = currentUser.verified;
                    next();
                    return;
                }
            });
            
        } else{ //If the token is valid
            req.verification = true;
            req.username = access_token_decoded.username;
            console.log(access_token_decoded);
            const currentUser = await User.findOne({username: req.username});
            req.rating = currentUser.rating;
            req.verified = currentUser.verified;
            next();
            return;
        }
    });
}

route.get('/dashboard', authenticateToken, (req, res)=>{
    if(!req.verification) return res.redirect('/login');
    res.render('dashboard.ejs', {username: req.username, rating: req.rating, verified: req.verified});
});

route.post('/logout', authenticateToken , async (req, res)=>{
    console.log("LOGOUT");
    if(!req.verification) return res.redirect('/login');
    const refresh_token = req.cookies.icantseeyou;
    await Refresh_token.deleteOne({token: refresh_token});
    res.cookie('dontseethis', "", {path: '/', httpOnly: true, secure: false,  sameSite: 'strict'}).cookie('icantseeyou', "", {path: '/', httpOnly: true, secure: false,  sameSite: 'strict'}).redirect('/login');
});

route.post('/password-reset', authenticateToken, (req, res)=>{
    const {password} = req.body;
    const username = req.username;

});

route.get('/profile', authenticateToken, async (req, res)=>{
    res.render('profile.ejs');
});

route.post('/hackmein/ihavethecode', authenticateToken, async (req, res)=>{
    const code = req.body.code; 
    let entrycode = await Parcel.findOne({code}); 
    if(!entrycode){
        res.render('sign-up-challenge.ejs', {error: 'We will give you another chance :)'});
        return res.redirect('/user/sign-up-challenge');
    } else{
        const current_user = await User.findOne({username: req.username});
        current_user.verified = true;
        current_user.rating = current_user.rating + 200;
        current_user.save().then().catch(()=>console.log("Cannot update value")); 
        await Parcel.deleteOne({code});
        res.redirect('/user/dashboard');
    }
});

route.get('/sign-up-challenge', authenticateToken, (req, res)=>{
    res.render('sign-up-challenge.ejs', {error: 'Hacking is fun :)'});
})

module.exports = route;
const route = require('express').Router();
const jwt = require('jsonwebtoken');
const Refresh_token = require('../models/refresh');

function authenticateToken(req, res, next){
    const token = req.cookies && req.cookies.dontseethis;
    if(token == null){ req.verification = false; next(); return; }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken)=>{
        try{
            if(err){
                //The token is either expired or tampered with or some unknown reason is here
                if(err.name === 'JsonWebTokenError'){ //If this is called, that means that our token is tampered with or corrupted or something of that sort. 
                    req.verification = false; 
                    next(); 
                    return;
                } else{ //Token has expired;
                     //Let's check the refresh token and make a new ACESS_TOKEN
                    const refreshToken = req.cookies.icantseeyou;
                    //User don't have a refresh token
                    if(refreshToken == null){ req.verification = false; next(); return; }
                    let user_refresh_token = await Refresh_token.findOne({token: refreshToken});
                    user_refresh_token = user_refresh_token && user_refresh_token.token;
                    //The refresh token send by the user is not valid.
                    if(!user_refresh_token){ req.verification = false; next(); return; }
                    //All great till now. User has a refresh token and is valid in database.
                    //Now we need to check if it's not expired or anything.
                    jwt.verify(user_refresh_token, process.env.REFRESH_TOKEN_SECRET, async(err, token)=>{
                        if(err){//If anything fails here, just go to login.
                            console.log(err);
                            await Refresh_token.remove({token: user_refresh_token});
                            req.verification = false;
                            next(); 
                            return; 
                        }
                        //Now the token is valid and we can create a new access token
                        const newAccessToken = jwt.sign({username: token.username}, process.env.ACCESS_TOKEN_SECRET, {algorithm: 'HS256', expiresIn: '1m'});
                        res.cookie('dontseethis', newAccessToken, {path: '/', httpOnly: true, secure: false,  sameSite: 'strict'});
                        //console.log("New access token defined");
                        req.verification = true;
                    });
                }
            } else{
                req.verification = true;
            }
            req.username = token && token.username;
            next();
            return;
        } catch (err){
            console.log(err);
            req.verification = false;
            next();
            return;
        }
    });
}

route.get('/dashboard', authenticateToken, (req, res)=>{
    if(!req.verification) return res.redirect('/login');
    res.render('dashboard.ejs');
});

route.post('/logout', authenticateToken , async (req, res)=>{
    console.log("LOGOUT");
    if(!req.verification) return res.redirect('/login');
    const refresh_token = req.cookies.icantseeyou;
    await Refresh_token.deleteOne({token: refresh_token});
    res.cookie('dontseethis', "", {path: '/', httpOnly: true, secure: false,  sameSite: 'strict'}).redirect('/login');
});

route.post('/password-reset', authenticateToken, (req, res)=>{
    const {password} = req.body;
    const username = req.username;

});

route.get('/profile', authenticateToken, async (req, res)=>{
    
});

module.exports = route;
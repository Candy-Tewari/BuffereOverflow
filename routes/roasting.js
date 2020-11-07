const route = require('express').Router();
const ForgotPassword = require('../models/forgot-password.js');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

route.post('/', (req, res)=>{
    const {password, re_enter_password, token} = req.body;
    if(!password || !re_enter_password || !token) return res.redirect('/not-found');
    if(password !== re_enter_password) return res.redirect('/not-found');
    jwt.verify(token, process.env.PASSWORD_RESET_TOKEN_SECRET, async (err, decoded)=>{
        if(err) return res.redirect('/not-found');
        //Reset password here
        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ email: decoded.email }, { password: encryptedPassword }, {new: true});
        res.redirect('/login');
    });
});

route.get('*', async (req, res)=>{
    const link = req.url.substring(1);
    const reset_user = await ForgotPassword.findOne({link});
    if(!reset_user) return res.redirect('/not-found');
    await ForgotPassword.deleteOne({link});
    const token = jwt.sign({email: reset_user.email}, process.env.PASSWORD_RESET_TOKEN_SECRET, {expiresIn: '2m', algorithm: 'HS256'});
    res.render('roaster.ejs', {token});
});

module.exports = route;
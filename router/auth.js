const express = require('express');
const signupUser = require('../dbutil/signupUser');
const loginUser = require('../dbutil/loginUser');
const checkOnboarding2 = require('../dbutil/checkOnboarding2');
const fetchuser = require('../middleware/fetchUser');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const UserAuth = process.env.USER_AUTH;

const router = express();

router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if(!email) return res.status(400).json({status:false,msg:"Please enter email"});
    if(!password) return res.status(400).json({status:false,msg:"Please enter password"});
    signupUser(email, password, res);

});

router.post('/login', (req, res) => {
    const token = req.header("authtoken");
    if (!token) {
        const { email, password } = req.body;
        if (!email) res.status(400).json({ status: false, msg: "Please provide the email" });
        if (!password) res.status(400).json({ status: false, msg: "Please provide the password" });

        loginUser(email, password, res);
        return;
    } else {
        try {
            const data = jwt.verify(token, UserAuth);
            loginUser(data.email, data.password, res);
        }
        catch (err) {
            res.status(500).json({ msg: "Invalid token" });
        }
    }

});

router.post('/checkOnboarding2', fetchuser,  (req, res) => {
    checkOnboarding2(req.data.email, res);
});


module.exports = router;
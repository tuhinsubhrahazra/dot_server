var jwt = require('jsonwebtoken');

const UserAuth = process.env.USER_AUTH;

const fetchuser = (req, res, next) => {
    const token = req.header("authtoken");
    if (!token) return res.status(401).json({ msg: "please authenticate using valid token" });
    try {
        const data = jwt.verify(token, UserAuth);
        req.data = data;
        next();
    }
    catch (err) {
        res.status(500).json({ msg: "Invalid token" });
    }
}

module.exports = fetchuser;
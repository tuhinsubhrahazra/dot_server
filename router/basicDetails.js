const express = require('express');
const saveBasicDetails = require('../dbutil/saveBasicDetails');
const fetchuser = require('../middleware/fetchUser');

const router = express();

router.post('/addBasicDetails', fetchuser, (req, res) => {
    const { name, gender, dob } = req.body;
    if (!name) res.status(400).json({ status: false, msg: "Please provide the name" });
    else if (!gender) res.status(400).json({ status: false, msg: "Please provide the gender" });
    else if (!dob) res.status(400).json({ status: false, msg: "Please provide the dob" });
    else {
        const userid = req.data.email;
        console.log(userid);
        saveBasicDetails(userid, name, gender, dob, res);
    }
});




module.exports = router;
const express = require('express');
const saveLink = require('../dbutil/saveLink');
const isLinkExist = require('../dbutil/isLinkExist');
const fetchuser = require('../middleware/fetchUser');
const addBio = require('../dbutil/addBio');
const addLinks = require('../dbutil/addLinks');
const saveNameSkills = require('../dbutil/saveNameSkills');
const geturls = require('../dbutil/geturls');
const getProfileData = require('../dbutil/getProfileData');
const uploadProfilePic = require('../dbutil/uploadProfilePic');
const getProfilePic = require('../dbutil/getProfilePic');
const uploadCoverPic = require('../dbutil/uploadCoverPic');
const getCoverPic = require('../dbutil/getCoverPic');
const getProfiledataForEdit = require('../dbutil/getProfiledataForEdit');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const UserAuth = process.env.USER_AUTH;

const router = express();

// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, callback) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const fileExtension = path.extname(file.originalname);
//         callback(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
//     },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/isLinkExist', fetchuser, (req, res) => {
    try {
        const { link } = req.body;
        if (!link) return res.status(400).json({ status: false, msg: "Please provide the link" });
        isLinkExist(link, res);
    } catch (error) {
        console.log(error);
    }
});

router.post('/addlink', fetchuser, (req, res) => {
    const { link, skills } = req.body;
    console.log(link);
    if (!link) return res.status(400).json({ status: false, msg: "Please provide the link" });
    if (!skills) return res.status(400).json({ status: false, msg: "Please provide the skills" });
    const userid = req.data.email;
    saveLink(link, userid, skills, res);
});

router.post('/addBioAndUrl', fetchuser, (req, res) => {
    console.log(JSON.stringify(req.body));

    const { name, skills, headline, work, location, education } = req.body;
    if (!name) return res.status(400).json({ status: false, msg: "Please provide the name" });
    // if (!skills) return res.status(400).json({ status: false, msg: "Please provide the skills" });
    // if (!headline) return res.status(400).json({ status: false, msg: "Please provide the link" });
    // if (!work) return res.status(400).json({ status: false, msg: "Please provide the work" });
    // if (!location) return res.status(400).json({ status: false, msg: "Please provide the location" });
    // if (!education) return res.status(400).json({ status: false, msg: "Please provide the education" });
    // if(!links) return res.status(400) .json({ status: false, msg: "Please provide the links" });
    
    let err2 = addBio(req.data.email, headline, work, location, education);
    // let err = addLinks(req.data.email, links);
    let err3 = saveNameSkills(req.data.email, name, skills);

    if (err3 && err2) {
        console.log("ise 500");
        console.log(err2);
        console.log(err3);
        res.status(500).json({ status: false, msg: "Internal server error" });
    } else {
        res.status(201).json({ status: true, msg: "data inserted successfully" });
    }
});

router.post("/addProfilePic", fetchuser, upload.single('image'), (req, res) => {
    if(req.file) uploadProfilePic(req,res);
    else return res.status(400).json({ status: false, msg: "Please provide the profile pic image file" });
});

router.get("/getProfilePic", (req, res) => {
    const link = req.query.link;
    getProfilePic(res, link);
});

router.post("/addCoverPic", fetchuser, upload.single('image'), (req, res) => {
    if(req.file) uploadCoverPic(req,res);
    else return res.status(400).json({ status: false, msg: "Please provide the cover pic image file" });
});

router.get("/getCoverPic", (req, res) => {
    const link = req.query.link;
    getCoverPic(res, link);
});

router.post("/addUrls", fetchuser, (req, res) => {
    const { links } = req.body;
    if (!links) return res.status(400).json({ status: false, msg: "Please provide the links" });

    addLinks(res, req.data.email, links);
});

router.post("/getUrls", fetchuser, (req, res) => {
    const { type } = req.body;
    if (!type) return res.status(400).json({ status: false, msg: "Please provide the type" });
    geturls(req.data.email, type, res);
});

router.post("/getProfileData", (req, res) => {
    const { link } = req.body;
    if (!link) return res.status(400).json({ status: false, msg: "Please provide the link" });
    // getProfileData(req.data.email, link, res);

    const token = req.header("authtoken");
    if (!token) {
        getProfileData("", link, res);
        return;
    } else {
        try {
            const data = jwt.verify(token, UserAuth);
            getProfileData(data.email, link, res);
        }
        catch (err) {
            // res.status(500).json({ msg: "Invalid token" });
            getProfileData("", link, res);
        }
    }

});

router.post("/getProfiledataForEdit", fetchuser, (req,res)=>{
    getProfiledataForEdit(req.data.email, res);
});

module.exports = router;
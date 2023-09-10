const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function getProfiledataForEdit(userid, res) {
    var query = `SELECT
    p.link AS profile_link,
    p.userid AS profile_userid,
    p.skills AS profile_skills,
    p.bio_headline AS profile_bio_headline,
    p.bio_work AS profile_bio_work,
    p.bio_location AS profile_bio_location,
    p.bio_education AS profile_bio_education,
    
    bd.name AS basicdetails_name,
    bd.gender AS basicdetails_gender,
    bd.dob AS basicdetails_dob,
    
    cp.filename AS coverpic_filename,
    cp.content_type AS coverpic_content_type,
    cp.image_data AS coverpic_image_data,
    
    pp.filename AS profilepic_filename,
    pp.content_type AS profilepic_content_type,
    pp.image_data AS profilepic_image_data
    
FROM
    profile p
    LEFT JOIN basicdetails bd ON p.userid = bd.userid
    LEFT JOIN coverPic cp ON p.userid = cp.userid
    LEFT JOIN profilePic pp ON p.userid = pp.userid
WHERE
    p.userid = '${userid}';
`;

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(500).json({ status: false, result: [], msg: "Internal server error1" });
        } else {
            if (result.rowCount < 1) {
                return res.status(404).json({ status: false, result: [], msg: "Invalid userid" });
            } else {
                return res.status(200).json({ status: true, profileData: result.rows, msg: "Data found" });
            }
        }
    });
}

module.exports = getProfiledataForEdit;
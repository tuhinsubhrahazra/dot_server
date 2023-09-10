const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function getProfileData(userid, link, res) {
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

    cp.image_data AS coverpic_image_data,
    pp.image_data AS profilepic_image_data,

    json_agg(json_build_object('type', l.type, 'value', l.value)) AS links

  FROM
    profile p
    LEFT JOIN basicdetails bd ON p.userid = bd.userid
    LEFT JOIN links l ON p.userid = l.userid
    LEFT JOIN profilepic pp ON p.userid = pp.userid
    LEFT JOIN coverpic cp ON p.userid = cp.userid
  WHERE
    p.link = '${link}'
GROUP BY
    p.link, p.userid, p.skills, p.bio_headline, p.bio_work, p.bio_location, p.bio_education,
    bd.name, bd.gender, bd.dob, cp.image_data, pp.image_data
`;

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(500).json({ status: false, result: [], msg: "Internal server error" });
        } else {
            if (result.rowCount < 1) {
                return res.status(404).json({ status: false, result: [], msg: "Invalid url" });
            } else {
                return res.status(200).json({ status: true, isSameUser: userid===result.rows[0].profile_userid , profileData: result.rows, msg: "Data found" });
            }
        }
    });
}

module.exports = getProfileData;
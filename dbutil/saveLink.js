const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function saveLink(link, userid, skills,res) {

    let query = `INSERT INTO profile (link, userid, skills)
    VALUES ('${link}', '${userid}', '${skills}')
    ON CONFLICT (userid)
    DO UPDATE SET
        link = EXCLUDED.link,
        userid = EXCLUDED.userid,
        skills = EXCLUDED.skills;
    `

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            saveProcess(userid, res);
        }
    });
}

function saveProcess(userid, res) {
    let query = `UPDATE "USER" SET process = 2 WHERE email = '${userid}'`
    pool.query(query,(err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(404).json({status:false, msg:"Internal server error"});
        } else {
            res.status(201).json({status:true, msg:"link saved successfully"});
        }
    });
}

module.exports = saveLink;
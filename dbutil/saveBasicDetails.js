const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});
function saveBasicDetails(userid, name,gender, dob, res) {

    let query = `INSERT INTO basicdetails (userid, name, gender, dob)
    VALUES ('${userid}', '${name}', '${gender}', '${dob}')
    ON CONFLICT (userid)
    DO UPDATE SET
        name = EXCLUDED.name,
        gender = EXCLUDED.gender,
        dob = EXCLUDED.dob;
    `
    pool.query(query,(err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(404).json({status:false, msg:"Internal server error"});
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
            res.status(201).json({status:true, msg:"Basic details saved successfully"});
        }
    });
}

module.exports = saveBasicDetails;
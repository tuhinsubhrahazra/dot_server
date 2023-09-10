const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function checkOnboarding2(userid, res) {
    pool.query(`select process from "USER" where email = '${userid}'`, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(500).json({ status: false, msg: "Internal server error" });
        } else {
            if(result.rows[0].process > 0){
                return res.status(200).json({ status: true, msg: "valid" });
            }else{
                return res.status(400).json({ status: false, msg: "invalid" });
            }
        }
    });

}



module.exports = checkOnboarding2;
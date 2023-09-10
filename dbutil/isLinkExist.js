const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function isLinkExist(link,res) {
    pool.query(`select link from profile where link = '${link}'`, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            if(result.rowCount>0){
                return res.status(400).json({status:false,msg:"This username is already in use, please enter something else."});
            }else{
                return res.status(201).json({status:true, msg:"link available"});
            }
        }
    });
}

module.exports = isLinkExist;
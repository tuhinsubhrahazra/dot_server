const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function geturls(userid, type, res) {

    type = type.toLowerCase();
    console.log(type);
    var query = `select type, value from links where userid = '${userid}' and type like '%${type}%'`;

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(200).json({ status: false, result: [] });
        } else {
            console.log(result.rows);   
            return res.status(200).json({ status: true, result: result.rows });
        }
    });

}

module.exports = geturls;
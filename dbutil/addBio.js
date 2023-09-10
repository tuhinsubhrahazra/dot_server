const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function addBio(userid, headline, work, location, educaton){
    console.log(userid);
    let error = false;
    pool.query(`update profile set bio_headline = '${headline}', bio_work = '${work}', bio_location = '${location}', bio_education = '${educaton}' where userid= '${userid}'`, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            error = true;
        } else {
            console.log("bio updated successfully: "+JSON.stringify(result.rows));
        }
    });

    return error;
}

module.exports = addBio;
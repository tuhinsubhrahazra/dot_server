const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function saveNameSkills(userid, name, skills) {

    let error = false;

    let query = `INSERT INTO basicdetails (userid, name)
    VALUES ('${userid}', '${name}')
    ON CONFLICT (userid)
    DO UPDATE SET
        name = EXCLUDED.name
    `
    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            error = true;
        } else {
            console.log("name saved successfully");
        }
    });

    setTimeout(() => {

        let query2 = `UPDATE profile
        SET skills = '${skills}'
        WHERE userid = '${userid}';`

        pool.query(query2, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                error = true;
            } else {
                console.log("skills saved successfully");
            }
        });

    },1000);

    return error;
}

module.exports = saveNameSkills;
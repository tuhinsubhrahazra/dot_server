const { Pool, Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function addLinks(res, userid, links) {
    pool.query(`delete from links where userid = '${userid}' and type like '%${links[0].type}%'`, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            return res.status(500).json({ status: false, msg: "Internal server error" });
        } else {
            console.log("data deleted");

            setTimeout(() => {
                for (let i = 0; i < links.length; i++) {
                    setTimeout(() => {
                        pool.query(`insert into links (userid, type, value) values('${userid}','${links[i].type}', '${links[i].value}')`, (err, result) => {
                            if (err) {
                                console.error('Error executing query', err);
                                return res.status(500).json({ status: false, msg: "Internal server error" });
                            } else {
                                console.log("data inserted");
                                if(i==links.length-1) res.status(201).json({ status: true, msg: "data inserted successfully" });
                            }
                        });
                    }, 500)
                }
            }, 500)
        }
    });

}



module.exports = addLinks;
const { Pool, Client } = require('pg');
require('dotenv').config();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

async function getCoverPic(res, link) {
    try {
        var query2 = `select userid from profile where link = '${link}'`
        pool.query(query2, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                return res.status(200).json({ status: false, result: [] });
            } else {
                console.log(result.rows);

                if(result.rowCount<1){
                    return res.status(404).json({ status: false, result: [] });
                }

                var query = `select * from coverPic where userid = '${result.rows[0].userid}'`;

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
        });
    } catch (e) {
        res.status(500).json({
            "status": false,
            "msg": "Internal server error"
        });
    }

}

module.exports = getCoverPic;
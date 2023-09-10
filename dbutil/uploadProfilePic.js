const { Pool, Client } = require('pg');
require('dotenv').config();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

async function uploadProfilePic(req, res) {
    console.log(req.image);
    try {
        if (req.file) {
            console.log(req.file);
            const { originalname, mimetype, buffer } = req.file;

            const userid = req.data.email;

            const query = `
        INSERT INTO profilePic (userid, filename, content_type, image_data)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (userid) DO UPDATE
        SET filename = $2, content_type = $3, image_data = $4
      `;

            const values = [userid, originalname, mimetype, buffer];

            const client = await pool.connect();
            await client.query(query, values);
            client.release();

            res.status(200).json({
                "status": true,
                "msg": "Image uploaded successfully"
            });
        }
    } catch (e) {
        res.status(500).json({
            "status": false,
            "msg": "Internal server error"
        });
    }

}

module.exports = uploadProfilePic;
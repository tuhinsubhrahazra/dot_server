const { Pool, Client } = require('pg');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const UserAuth = process.env.USER_AUTH;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function loginUser(email,password, res) {
    let query = `SELECT
    u.email AS email,
    u.process AS process,
    u.password AS password,
    p.link AS link
FROM
    "USER" u
    LEFT JOIN profile p ON u.email = p.userid
WHERE
    u.email = '${email}';`

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            if(result.rowCount>0){
                if(result.rows[0].password === password){
                    console.log(result.rows[0]);
                    var token = jwt.sign({ email: email, password:password }, UserAuth);
                    res.status(200).json({status: true, process:result.rows[0].process, link: result.rows[0].process>1?result.rows[0].link: "" ,  msg:"Authentication successfull", token: token});
                    return;
                }else{
                    res.status(404).json({status: false, msg:"The entered password is incorrect. Please try again."});
                    return;
                }
            }else{
                res.status(404).json({status: false, msg:"There is no account signed up with this email."});
            }
        }
    });
}

module.exports = loginUser;
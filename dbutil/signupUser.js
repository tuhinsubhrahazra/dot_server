const { Pool, Client } = require('pg');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const UserAuth = process.env.USER_AUTH;

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
});

function signupUser(email,password, res) {

    pool.query(`SELECT email FROM "USER" WHERE email='${email}'`, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            if(result.rowCount>0){
                return res.status(400).json({status:false,msg:"There is already an account signed up with this email."});
            }else{
                insertUser(email,password,res);
            }
        }
    });
}

function insertUser(email, password, res) {
    pool.query(`insert into "USER" (email, password, process) values('${email}','${password}', 0)`, (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            var token = jwt.sign({ email: email, password:password }, UserAuth);
            return res.status(201).json({status:true, msg:"Signed up successfull",token: token});
        }
    });
}

module.exports = signupUser;
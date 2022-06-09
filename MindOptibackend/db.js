const Pool = require("pg").Pool;


const pool = new Pool ({
    host : "localhost",
    user : "postgres",
    password : "R@s#1997",
    database : "lms",
    port : 5432
})
pool.connect();

module.exports = pool;
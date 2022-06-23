const Pool = require("pg").Pool;


const pool = new Pool ({
    host : "localhost",
    user : "neww",
    password : "1999",
    database : "lms",
    port : 5432
})
pool.connect();

module.exports = pool;
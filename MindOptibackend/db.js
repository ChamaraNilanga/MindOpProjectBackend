const Pool = require("pg").Pool;


const pool = new Pool ({
    host : "localhost",
    user : "chamaranilangakarunarathna",
    password : "1999",
    database : "LMS",
    port : 5432
})
pool.connect();

module.exports = pool;
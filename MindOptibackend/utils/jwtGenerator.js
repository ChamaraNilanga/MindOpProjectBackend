const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id,  teacher,student,admin) {
  const payload = {
    user: {
      id: user_id,
      teacher:teacher,
      student:student,
      admin:admin
    }
  };

  return jwt.sign(payload, process.env.JWTSECRET, { expiresIn: "1h" });
}

module.exports = jwtGenerator;

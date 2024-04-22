const bcrypt = require("bcrypt");

module.exports.generatePassword = password => {
    return bcrypt.hash(password, 10)
};

module.exports.verifyPassword = (password, userPassword) => {
   return bcrypt.compare(password, userPassword)
};


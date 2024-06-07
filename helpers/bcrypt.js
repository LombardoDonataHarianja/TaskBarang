const bcryptjs = require("bcryptjs");

const generateHash = (plaintext) => {
  return bcryptjs.hashSync(plaintext, 10);
};

const verifyHash = (plaintext, hash) => {
  return bcryptjs.compareSync(plaintext, hash);
};

module.exports = {
  generateHash,
  verifyHash,
};

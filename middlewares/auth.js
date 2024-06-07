const { readPayloadFromToken } = require("../helpers/jwt");
const { User } = require("../models");

const auth = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const payload = readPayloadFromToken(access_token);
    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      throw { name: "Unauthorized" };
    }
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth
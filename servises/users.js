const User = require("./schemas/users");
const Users = require("./schemas/users");

async function addUser(data) {
  return Users.create(data);
}

async function findByEmail(email) {
  return Users.findOne({ email });
}

async function findById(id) {
  return User.findOne({ _id: id });
}

async function updateUser(userId, data) {
  return Users.findByIdAndUpdate({ _id: userId }, data, { new: true });
}

module.exports = {
  addUser,
  findByEmail,
  findById,
  updateUser,
};

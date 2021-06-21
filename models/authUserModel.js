const mongoose = require('mongoose');

const authUserSchema = new mongoose.Schema({
	email: String
});

const AuthUser = mongoose.model("authUser", authUserSchema);

module.exports = AuthUser;
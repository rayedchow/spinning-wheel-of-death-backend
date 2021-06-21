const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
	userId: String,
	classData: [
		{
			classId: String,
			removedStudents: [ String ]
		}
	]
});

const UserData = mongoose.model("userData", userDataSchema);

module.exports = UserData;
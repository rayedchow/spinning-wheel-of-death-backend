const router = require('express').Router();
const AuthUser = require('../models/authUserModel');
const UserData = require('../models/userDataModel');

router.post('/removeStudent', async (req, res) => {
	try {
		const { email, classId, studentId } = req.body;

		if(!email || !classId || !studentId) {
			return res.status(400).json({
				error: 'Not Enough Data'
			});
		}

		const userAuthentication = await AuthUser.findOne({ email });
		if(!userAuthentication) {
			return res.status(400).json({
				error: 'Not Authenticated'
			});
		}

		const userData = await UserData.findOne({ userId: userAuthentication._id });
		
		if(!userData) {
			const newUserData = new UserData({
				userId: userAuthentication._id,
				classData: [{
					classId,
					removedStudents: [studentId]
				}]
			});

			const savedUserData = await newUserData.save();
			return res.json(savedUserData);
		}
		
		const classIndex = userData.classData.findIndex((classObj) => 
			classObj.classId === classId
		);

		userData.classData[classIndex].removedStudents.push(studentId);
		const savedUserData = await userData.save();

		return res.json(savedUserData);

	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});

module.exports = router;
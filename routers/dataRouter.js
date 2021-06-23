const router = require('express').Router();
const AuthUser = require('../models/authUserModel');
const UserData = require('../models/userDataModel');

router.post('/removeStudent', async (req, res) => {
	try {
		const { email, classId, studentId } = req.body;

		if(!email || !classId || !studentId) {
			return res.status(400).json({
				error: 'Not enough data'
			});
		}

		const userAuthentication = await AuthUser.findOne({ email });
		if(!userAuthentication) {
			console.log('err 2');
			return res.status(400).json({
				error: 'Not authenticated'
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

		if(classIndex === -1) {
			userData.classData.push({
				classId,
				removedStudents: [studentId]
			});

			const savedUserData = await userData.save();
			return res.json(savedUserData);
		}

		userData.classData[classIndex].removedStudents.push(studentId);
		const savedUserData = await userData.save();

		return res.json(savedUserData);

	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});

router.post('/addStudent', async (req, res) => {
	try {
		const { email, classId, studentId } = req.body;

		if(!email || !classId || !studentId) {
			return res.status(400).json({
				error: 'Not enough data'
			});
		}

		const userAuthentication = await AuthUser.findOne({ email });
		if(!userAuthentication) {
			return res.status(400).json({
				error: 'Not authenticated'
			});
		}

		const userData = await UserData.findOne({ userId: userAuthentication._id });
		if(!userData) {
			return res.status(400).json({
				error: 'Student already added'
			});
		}
		
		const classIndex = userData.classData.findIndex((classObj) => 
			classObj.classId === classId
		);

		const studentIndex = userData.classData[classIndex].removedStudents.indexOf(studentId);
		if(studentIndex === -1) {
			return res.status(400).json({
				error: 'Student already added'
			});
		}

		userData.classData[classIndex].removedStudents.splice(studentIndex, 1);
		const savedUserData = await userData.save();

		return res.json(savedUserData);

	} catch(err) {
		console.error(err);
		res.status(500).send();
	}	
});

router.post('/getData', async (req, res) => {
	try {
		const { email } = req.body;

		if(!email) {
			return res.status(400).json({
				error: 'Not enough data'
			});
		}

		const userAuthentication = await AuthUser.findOne({ email });
		if(!userAuthentication) {
			return res.status(400).json({
				error: 'Not authenticated'
			});
		}

		const userData = await UserData.findOne({ userId: userAuthentication._id });
		if(!userData) {
			const newUserData = new UserData({
				userId: userAuthentication._id,
				classData: []
			});

			const savedUserData = await newUserData.save();
			return res.json(savedUserData);
		}

		return res.json(userData);

	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});

router.post('/resetStudents', async (req, res) => {
	try {
		const { email, classId } = req.body;

		if(!email || !classId) {
			return res.status(400).json({
				error: 'Not enough data'
			});
		}

		const userAuthentication = await AuthUser.findOne({ email });
		if(!userAuthentication) {
			return res.status(400).json({
				error: 'Not authenticated'
			});
		}

		const userData = await UserData.findOne({ userId: userAuthentication._id });
		if(!userData) {
			const newUserData = new UserData({
				userId: userAuthentication._id,
				classData: []
			});

			const savedUserData = await newUserData.save();
			return res.json(savedUserData);
		}

		const classIndex = userData.classData.findIndex((classObj) => 
			classObj.classId === classId
		);

		if(classIndex === -1) {
			userData.classData.push({
				classId,
				removedStudents: []
			});

			const savedUserData = await userData.save();
			return res.json(savedUserData);
		}

		userData.classData[classIndex].removedStudents = [];

		const savedUserData = await userData.save();
		return res.json(savedUserData);

	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});

module.exports = router;
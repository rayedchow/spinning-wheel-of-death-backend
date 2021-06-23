const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
app.listen(port, () => 
	console.log(`[SERVER] Backend Server Initiated (PORT ${port})`)
);

app.use(express.json());
app.use(cors({
	origin: [
		'http://localhost:3000',
		'https://spinningwheelofdeath.ml',
		'https://spinningwheelofdeath.herokuapp.com'
	]
}));

mongoose.connect(
	process.env.MONGODB_CONNECT,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
		if (err) return console.error(err);
		console.log('[SERVER] MongoDB Connection Initiated');
	}
);

app.use("/auth", require("./routers/authRouter"));
app.use("/data", require("./routers/dataRouter"));
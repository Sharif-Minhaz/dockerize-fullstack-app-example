const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

const data = [
	{
		id: 1,
		name: "John Doe",
		designation: "Software Engineer",
		age: 30,
	},
	{
		id: 2,
		name: "Jane Doe",
		designation: "Dish Washer",
		age: 20,
	},
	{
		id: 3,
		name: "Bob Smith",
		designation: "Teacher",
		age: 40,
	},
	{
		id: 4,
		name: "David Johnson",
		designation: "Accountant",
		age: 25,
	},
];

app.get("/health", (req, res) => {
	res.status(200).json({ message: "Server is healthy" });
});

app.get("/users", (req, res) => {
	res.status(200).json(data);
});

app.listen(8080, () => {
	console.log({
		message: "Server is running on port 8080",
		serverKey: process.env.SERVER_KEY,
	});
});

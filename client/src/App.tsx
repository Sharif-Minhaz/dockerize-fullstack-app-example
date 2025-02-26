import { useEffect, useState } from "react";
import "./App.css";

interface IUser {
	id: number;
	name: string;
	designation: string;
	age: number;
}

function App() {
	const [users, setUsers] = useState<IUser[]>([]);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/users`)
			.then((res) => res.json())
			.then((data) => setUsers(data));
	}, []);

	return (
		<div>
			<h1>Welcome to user's dashboard</h1>
			<h3>Client Secret: {import.meta.env.VITE_CLIENT_SECRET}</h3>
			{users ? (
				<ul>
					{users.map((user: IUser) => (
						<li key={user?.id}>
							{user?.name} - {user?.designation} - {user?.age} years
						</li>
					))}
				</ul>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}

export default App;

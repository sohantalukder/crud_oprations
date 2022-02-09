const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
	'mongodb+srv://user1:Ig8dNZxMx1ZbwBOT@cluster0.kyofh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
async function run() {
	try {
		// Connect the client to the server
		await client.connect();
		// Establish and verify connection
		const database = client.db('CURD_OPERATIONS');
		const usersCollection = database.collection('users');
		console.log('Connected successfully to Database');

		//Get API
		app.get('/users', async (req, res) => {
			const cursor = usersCollection.find({});
			const users = await cursor.toArray();
			res.send(users);
		});

		//Update API
		app.get('/users/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const user = await usersCollection.findOne(query);
			// console.log('Load user with id', id);
			res.send(user);
		});

		//POST api
		app.post('/users', async (req, res) => {
			const newUser = req.body;
			const result = await usersCollection.insertOne(newUser);
			console.log('hitting the post', req.body);
			res.json(result);
		});
		//UPDATE API
		app.put('/users/:id', async (req, res) => {
			const id = req.params.id;
			const updatedUser = req.body;
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					name: updatedUser.name,
					email: updatedUser.email,
				},
			};
			const result = await usersCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			console.log('updating', id);
			res.json(result);
		});

		// DELETE API
		app.delete('/users/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await usersCollection.deleteOne(query);

			console.log('Deleting user with id', result);
			res.json(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Running my CRUD Server');
});

app.listen(port, () => {
	console.log('Running Server on port', port);
});

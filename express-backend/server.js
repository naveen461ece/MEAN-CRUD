const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/angularCrud', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define Schema and Model (e.g., for a 'tasks' collection)
const taskSchema = new mongoose.Schema({ // variable taskSchema 
  //mongoose.Schema({: Creates a new instance of the mongoose.Schema 
  //constructor, which is used to define the structure of documents 
  //in a MongoDB collection.
  title: String, //property title and its data type string 
  description: String,
});

const Task = mongoose.model('Task', taskSchema);

//mongoose.model('Task', taskSchema);: Creates a new model named Task 
//based on the taskSchema defined earlier. The first argument ('Task') is 
//the singular name of the collection that the model will interact with
// (Mongoose will automatically convert it to plural and lowercase for
// storage, so the actual collection name will be tasks).
// The second argument (taskSchema) is the schema object that defines 
//the document structure.

// CRUD Endpoints
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
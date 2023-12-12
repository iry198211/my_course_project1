const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON in requests
app.use(bodyParser.json());

// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/your_database_name', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Check connection
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', (err) => {
    console.log(err);
});

// Define task schema
const taskSchema = new mongoose.Schema({
    name: String,
});

const Task = mongoose.model('Task', taskSchema);

// RESTful API Endpoints for tasks (add, delete, get all)
app.post('/tasks', async (req, res) => {
    const { name } = req.body;

    try {
        const newTask = new Task({ name });
        await newTask.save();
        res.json({ message: 'Task added successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Error adding task' });
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error getting tasks' });
    }
});

app.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        await Task.findByIdAndDelete(taskId);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

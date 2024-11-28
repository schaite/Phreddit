// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
port = 8000;

app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/phreddit', {
    serverSelectionTimeoutMS: 10000, // 10 seconds
});
  
const db = mongoose.connection;
db.on('connected', () => console.log('Connected to MongoDB successfully'));
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.on('disconnected', () => console.log('Database instance disconnected.'));
  
app.use(express.json());

const communityRoutes = require('./routes/communities');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const linkFlairRoutes = require('./routes/linkflairs');
const userRoutes = require('./routes/users');
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/linkflairs', linkFlairRoutes);
app.use('/api/users', userRoutes);

app.get("/", function (req, res) {
    res.send("Hello Phreddit!");
});

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

//This give the terminating message
process.on('SIGINT', async () => {
    console.log('\nServer is shutting down...');
    try {
        await db.close(); 
        console.log('Server closed. Database instance disconnected.');
        process.exit(0);
    } catch (error) {
        console.error('Error during disconnect:', error);
        process.exit(1);
    }
});
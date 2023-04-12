const express = require('express');
const path = require('path');
const fs = require('fs')
const notes = require('./db/db.json');

// Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001;
const app = express();

//  Static middleware pointing to the public folder
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Create Express.js routes for default '/', '/send' and '/routes' endpoints

// Get /notes path
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})
//Post notes path
app.post('/api/notes', (req, res) => {
    req.body.id = notes.length += 1;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        let activeNotes = JSON.parse(data);
        activeNotes.push(req.body);
        fs.writeFile('./db/db.json', JSON.stringify(activeNotes), (err) => {
            if (err) {
                console.log(err);
            }
        })
    });
    res.json();
})

//Create Delete route
app.delete('/api/notes/:id', (req, res) => {
    let notesId = parseInt(req.params.id);

    fs.readFile('./db/db.json','utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        activeNotes = JSON.parse(data);
        let newNote = activeNotes.filter(note => note.id !== notesId);
        fs.writeFile('./db/db.json', JSON.stringify(newNote), (err) => {
            if (err) {
                console.log(err);
            }
        })
        res.json(newNote);
    })
})

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT} `);
});
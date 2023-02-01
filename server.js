const fs = require('fs');
const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils')
const uuid = require ('./helpers/uuid')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) =>{
    readFromFile('./db/db.json').then((data) => {
        res.json(JSON.parse(data))
    })
});

app.post('/api/notes', (req,res) => {
    const { title, text } = req.body;

    if ( title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid()
        };
        readAndAppend(newNote, './db/db.json');
        const response = {
            status: 'success',
            body: newNote
        };
        res.json(response);
    } else {
        res.json('Error in posting new note')
    }
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
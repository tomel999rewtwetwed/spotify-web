const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const app = express();

const MUSIC_FOLDER = path.join(__dirname, 'music');

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/download', (req, res) => {
    const link = req.body.link;

    exec(`spotdl "${link}" --output "${MUSIC_FOLDER}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`An error occurred while downloading music: ${stderr}`);
        }
        res.send(`Success! The music was downloaded from ${link} and saved in the folder ${MUSIC_FOLDER}.`);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

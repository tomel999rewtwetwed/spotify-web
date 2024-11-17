const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Dodaj CORS

const { Client } = require('discord-rpc');
const app = express();

const PORT = 3000;
const musicFolder = path.join(__dirname, 'music');
const client = new Client({ transport: 'ipc' });

app.use(cors()); // Włącz CORS

client.on('ready', () => {
    console.log('Discord RPC jest gotowe!');
});

client.login({ clientId: '1303788305422356480' }).catch(console.error);

app.get('/api/music', (req, res) => {
    fs.readdir(musicFolder, (err, files) => {
        if (err) {
            return res.status(500).send('Błąd serwera');
        }
        const mp3Files = files.filter(file => file.endsWith('.mp3'));
        console.log("Dostępne pliki MP3:", mp3Files); // Logowanie dostępnych plików
        res.json(mp3Files);
    });
});

app.use('/music', express.static(musicFolder));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

function updateDiscordRPC(track) {
    if (!client || !client.setActivity) {
        console.log('Discord RPC nie jest gotowe');
        return;
    }

    client.setActivity({
        details: `Odtwarzam: ${track}`,
        state: 'BETA lol',
        largeImageKey: '',
        largeImageText: '',
        startTimestamp: new Date(),
    }).catch((err) => {
        console.error('Błąd RPC:', err);
    });
}

app.post('/update-discord-rpc', express.json(), (req, res) => {
    const { track } = req.body;
    console.log("Otrzymano utwór do odtworzenia:", track);
    updateDiscordRPC(track);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});

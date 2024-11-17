const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const { Client } = require('discord-rpc');
const app = express();

const PORT = 3000;
const musicFolder = path.join(__dirname, 'music');
const client = new Client({ transport: 'ipc' });

app.use(cors());

client.on('ready', () => {
    console.log('Discord RPC is running!');
});

client.login({ clientId: '1303788305422356480' }).catch(console.error);

app.get('/api/music', (req, res) => {
    fs.readdir(musicFolder, (err, files) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        const mp3Files = files.filter(file => file.endsWith('.mp3'));
        console.log("Avaible MP3 files:", mp3Files);
        res.json(mp3Files);
    });
});

app.use('/music', express.static(musicFolder));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

function updateDiscordRPC(track) {
    if (!client || !client.setActivity) {
        console.log('Discord RPC doesnt start yet');
        return;
    }

    client.setActivity({
        details: `Listening to: ${track}`,
        state: 'BETA lol',
        largeImageKey: '',
        largeImageText: '',
        startTimestamp: new Date(),
    }).catch((err) => {
        console.error('RPC error:', err);
    });
}

app.post('/update-discord-rpc', express.json(), (req, res) => {
    const { track } = req.body;
    console.log("Music to listen:", track);
    updateDiscordRPC(track);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Serwer is running at http://localhost:${PORT}`);
});

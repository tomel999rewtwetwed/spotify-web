const express = require('express');
const fs = require('fs');
const path = require('path');
const { Client } = require('discord-rpc');

const app = express();
const PORT = 3000;
const musicFolder = path.join(__dirname, 'music');

const client = new Client({ transport: 'ipc' });

client.on('ready', () => {
    console.log('Discord RPC is ready!');
});

client.login({ clientId: '1303788305422356480' }).catch(console.error);

app.get('/api/music', (req, res) => {
    fs.readdir(musicFolder, (err, files) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        const mp3Files = files.filter(file => file.endsWith('.mp3'));
        res.json(mp3Files);
    });
});

app.use('/music', express.static(musicFolder));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

function updateDiscordRPC(track) {
    if (!client || !client.setActivity) {
        console.log('Discord RPC is not ready');
        return;
    }
  
    client.setActivity({
        details: `Playing: ${track}`,
        state: 'BETA lol',
        largeImageKey: '', 
        largeImageText: '',
        startTimestamp: new Date(),
    }).catch((err) => {
        console.error('RPC Error:', err);
    });
}

app.post('/update-discord-rpc', express.json(), (req, res) => {
    const { track } = req.body;
    updateDiscordRPC(track);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

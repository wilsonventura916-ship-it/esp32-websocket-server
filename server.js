const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve a página HTML estática
app.use(express.static(path.join(__dirname, 'public')));

// Rota alternativa para o HTML (opcional, pode remover se quiser)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado!');
    ws.on('message', (message) => {
        if (message instanceof Buffer) {
            // Transmite a imagem para todos os clientes (NÃO REMOVA)
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    });
});

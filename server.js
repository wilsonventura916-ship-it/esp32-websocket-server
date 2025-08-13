const express = require('express');
const WebSocket = require('ws');
const app = express();
const PORT = process.env.PORT || 3000;

// Servidor HTTP para teste (opcional)
app.get('/', (req, res) => {
  res.send('Servidor WebSocket ESP32-CAM');
});

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado!');

  ws.on('message', (message) => {
    // Se o ESP32 enviar imagens como buffer:
    if (message instanceof Buffer) {
      console.log('Imagem recebida!');
      // Transmite para todos os clientes (opcional)
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

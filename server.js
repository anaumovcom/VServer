const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on("connection", (ws) => {
  // Добавляем нового клиента в список
  clients.add(ws);

  // Обрабатываем входящие сообщения
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    // Пересылаем сообщение всем подключенным клиентам, кроме отправителя
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Удаляем клиента из списка при закрытии соединения
  ws.on("close", () => {
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");

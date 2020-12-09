import { ref } from 'vue';

export const useWebSocketConnection = () => {
  const connection = new WebSocket('wss://echo.websocket.org'); // 35.233.20.180:8080
  connection.addEventListener('open', () => {
    console.log('websocket connection opened');
  });
  const ws = ref(connection);

  return { ws };
};

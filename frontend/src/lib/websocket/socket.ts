import { Client } from '@stomp/stompjs';

const SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws';

class WebSocketService {
  private client: Client;
  private static instance: WebSocketService;

  private constructor() {
    this.client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
    };
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(): void {
    this.client.activate();
  }

  public disconnect(): void {
    this.client.deactivate();
  }

  public subscribeToPrivateMessages(userId: string, callback: (message: any) => void): void {
    this.client.subscribe(`/user/${userId}/queue/messages`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      callback(receivedMessage);
    });
  }

  public sendPrivateMessage(message: { senderId: string; receiverId: string; content: string }): void {
    this.client.publish({
      destination: '/app/chat',
      body: JSON.stringify(message),
    });
  }
}

export default WebSocketService; 
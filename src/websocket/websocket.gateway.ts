import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway {
  private readonly logger = new Logger(WebsocketGateway.name);
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_schedule')
  async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket, callback: (response: any) => void) {
    this.logger.log(`Message from client: ${client.id}`, data);
    switch (data) {
      case "time":
        // await setTime();
        callback("OK");
        console.log("Set Time schedule");
        break;
      case "backup":
        // await backup();
        console.log("Set Backup schedule");
        callback("OK");
        break;
    }
  }

  @SubscribeMessage('send_message')
  receiveMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): string {
    this.broadcastMessage('receive_message', data);
    return 'Message received';
  }

  broadcastMessage(event: string, data: any) {
    this.server.emit(event, data);
  }
}

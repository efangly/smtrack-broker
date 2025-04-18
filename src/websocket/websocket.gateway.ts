import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MqttService } from '../mqtt/mqtt.service';
import { ApiService } from '../api/api.service';
import { DeviceDto } from '../common/dto/device.dto';
import { format } from 'date-fns';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway {
  constructor(private readonly mqtt: MqttService, private readonly api: ApiService) {}
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
  async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.logger.log(`Message from client: ${client.id}`, data);
    switch (data) {
      case 'time':
        const device = await this.api.getDevice();
        if (device.length > 0) {
          this.logger.log(`Device found ${device.length} devices`);
          device.forEach((e: DeviceDto) => {
            if (e.id.substring(0, 4) === "eTPV") {
              this.mqtt.publish(`siamatic/etemp/${e.id.substring(3, 5).toLowerCase()}/${e.id}/time`, format(new Date(), "dd/MM/yyyy' 'HH:mm:ss"));
            } else {
              this.mqtt.publish(`siamatic/items/${e.id.substring(3, 5).toLowerCase()}/${e.id}/time`, format(new Date(), "dd/MM/yyyy' 'HH:mm:ss"));
            }
          });
        } else {
          this.logger.error('No device found');
        }
        return 'OK';
      case 'backup':
        await this.mqtt.publish('backup', 'get');
        return 'OK';
      default:
        return 'Invalid request';
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

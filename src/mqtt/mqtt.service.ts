import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { connect } from 'mqtt';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import type { MqttClient } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly socket: WebsocketGateway) {}
  private readonly logger = new Logger(MqttService.name);
  client: MqttClient;
  onModuleInit() {
     this.client = connect({
      host: process.env.MQTT_HOST,
      port: Number(process.env.MQTT_PORT),
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      clientId: 'broker_service'
    });
    this.client.on("connect", () => {
      this.client.subscribe("test", (err) => { if (err) this.client.end() });
    });
    this.client.on("error", (error) => {
      this.logger.log(error);
    });
    this.client.on("message", (topic, message) => {
      this.socket.broadcastMessage("receive_message", message.toString());
    });
  }

  async publish(topic: string, message: any) {
    this.client.publish(topic, message);
  }

  onModuleDestroy() {
    this.client.end();
  }
}

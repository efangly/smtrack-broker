import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsocketModule } from './websocket/websocket.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { MqttModule } from './mqtt/mqtt.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    ScheduleModule.forRoot(),
    WebsocketModule, 
    RabbitmqModule, 
    MqttModule, 
    HealthModule, 
    ConsumerModule
  ],
})
export class AppModule {}

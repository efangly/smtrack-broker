import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ConfigModule } from '@nestjs/config';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WebsocketModule,
  ],
  controllers: [ConsumerController]
})
export class ConsumerModule { }

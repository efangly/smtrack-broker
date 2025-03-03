import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(@Inject('RABBITMQ_SERVICE') private readonly log: ClientProxy) {}

  sendToLog<T>(queue: string, payload: T) {
    this.log.emit(queue, payload);
  }
}
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { OnlineDto } from '../common/dto/online.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';
;

@Controller()
export class ConsumerController {
  constructor(private readonly socket: WebsocketGateway) {}
  private readonly logger = new Logger(ConsumerController.name);

  @EventPattern('online-status')
  async backup(@Payload() data: OnlineDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      this.socket.broadcastMessage("receive_message", data);
      channel.ack(message);
    } catch (error) {
      this.logger.error(error);
      channel.nack(message, false, false);
    }
  }
}
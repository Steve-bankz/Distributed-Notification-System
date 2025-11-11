import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import * as amqp from 'amqplib';

@Module({
  imports: [HttpModule, UsersModule,],
  controllers: [NotificationsController],
  providers: [NotificationsService,
    {
      provide: 'RABBITMQ_CONNECTION',
      useFactory: async () => {
        const connection = await amqp.connect(process.env.RABBITMQ_CONNECTION_URL || 'amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();
        const exchange = process.env.RABBITMQ_EXCHANGE || 'notifications.direct';
        await channel.assertExchange(exchange, 'direct', { durable: true });
        return { channel, exchange };
      },
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}


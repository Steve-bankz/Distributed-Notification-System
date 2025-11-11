import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import Redis from 'ioredis';
import { CreateNotificationDto, NotificationType } from './dto/notification.dto';
import { UpdateNotificationStatusDto } from './dto/notification-status.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private redis: Redis;
  private channel: any;
  private exchange: string;

  constructor(
    @Inject('RABBITMQ_CONNECTION') private mqProvider: any,
    private readonly http: HttpService,
    private readonly usersService: UsersService,
  ) {
    this.channel = mqProvider?.channel;
    this.exchange = mqProvider?.exchange || process.env.RABBITMQ_EXCHANGE || 'notifications.direct';

    // Use environment variables for Redis connection
    this.redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => Math.min(times * 50, 2000), // retry with backoff
    });

    // Catch connection errors
    this.redis.on('error', (err) => {
      this.logger.error('[ioredis] Redis connection error:', err.message);
    });

    this.redis.on('connect', () => {
      this.logger.log('[ioredis] Connected to Redis successfully');
    });
  }

  // Safe Redis helpers
  private async safeSet(key: string, value: any, expireSec?: number) {
    try {
      if (this.redis.status !== 'ready') {
        this.logger.warn('[ioredis] Redis not ready, skipping set', key);
        return;
      }
      if (expireSec) {
        await this.redis.set(key, JSON.stringify(value), 'EX', expireSec);
      } else {
        await this.redis.set(key, JSON.stringify(value));
      }
    } catch (err) {
      this.logger.error('[ioredis] Failed to set key', key, err.message);
    }
  }

  private async safeGet(key: string) {
    try {
      if (this.redis.status !== 'ready') {
        this.logger.warn('[ioredis] Redis not ready, skipping get', key);
        return null;
      }
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      this.logger.error('[ioredis] Failed to get key', key, err.message);
      return null;
    }
  }

  private async safeLpush(key: string, value: any) {
    try {
      if (this.redis.status !== 'ready') return;
      await this.redis.lpush(key, JSON.stringify(value));
      await this.redis.ltrim(key, 0, 100);
    } catch (err) {
      this.logger.error('[ioredis] Failed to push list', key, err.message);
    }
  }

  // Handle create notification
  async handleNotification(payload: CreateNotificationDto) {
    const {
      notification_type,
      user_id,
      template_code,
      variables,
      request_id,
      priority,
      metadata,
    } = payload;

    if (!request_id) throw new BadRequestException('request_id is required');

    const existing = await this.safeGet(`notification:${request_id}`);
    if (existing) {
      this.logger.warn(`Duplicate request detected: ${request_id}`);
      throw new BadRequestException('Duplicate request_id detected');
    }

    let userRes;
    try {
      userRes = await this.usersService.forwardToUserService('GET', `/api/v1/users/${user_id}`);
    } catch (err) {
      this.logger.error('User service request failed', err?.message || err);
      throw new BadRequestException('Failed to fetch user');
    }

    const user = userRes?.data?.data;
    if (!user) throw new BadRequestException('User not found');

    const prefKey = notification_type === NotificationType.EMAIL ? 'email' : 'push';
    if (!user.preferences || !user.preferences[prefKey]) {
      throw new BadRequestException(`${notification_type} notifications disabled for user`);
    }

    const templateUrl = `${process.env.TEMPLATE_SERVICE_URL}/api/v1/templates/${encodeURIComponent(template_code)}`;
    let templateRes;
    try {
      templateRes = await lastValueFrom(this.http.get(templateUrl));
    } catch (err) {
      this.logger.error('Template service request failed', err?.response?.data || err.message);
      throw new BadRequestException('Failed to fetch template');
    }

    const template = templateRes?.data?.data;
    if (!template) throw new BadRequestException('Template not found');

    const message = {
      request_id,
      notification_type,
      user_id,
      user,
      template_code,
      template,
      variables,
      priority: Number(priority) || 0,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    };

    try {
      const routingKey = notification_type;
      const payloadBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.publish(this.exchange, routingKey, payloadBuffer, {
        persistent: true,
        priority: Math.min(Math.max(Number(priority) || 0, 0), 9),
      });
    } catch (err) {
      this.logger.error('Failed to publish to queue', err?.message || err);
      throw new BadRequestException('Failed to queue notification');
    }

    await this.safeSet(`notification:${request_id}`, { status: 'queued', created_at: new Date().toISOString() }, 60 * 60 * 24);

    return {
      message: `${notification_type} notification queued successfully`,
      data: { request_id, notification_type, priority },
      meta: null,
    };
  }

  // Update status
  async updateStatus(notification_type: string, body: UpdateNotificationStatusDto) {
    const { notification_id, status, timestamp, error } = body;

    if (!notification_id) throw new BadRequestException('notification_id required');

    const record = {
      status,
      error: error || null,
      updated_at: timestamp || new Date().toISOString(),
      source: notification_type,
    };

    await this.safeSet(`notification:${notification_id}`, record, 60 * 60 * 24 * 7);
    await this.safeLpush(`notification_events:${notification_id}`, record);

    return {
      message: `${notification_type} notification status updated`,
      data: { notification_id, status, error },
      meta: null,
    };
  }

  // Get status
  async getStatus(request_id: string) {
    const parsed = await this.safeGet(`notification:${request_id}`);
    if (!parsed) return { message: 'not found', data: null, meta: null };

    const eventsRaw = await this.redis.lrange(`notification_events:${request_id}`, 0, 50);
    const events = eventsRaw.map(e => {
      try { return JSON.parse(e); } catch { return e; }
    });

    return { message: 'ok', data: { request_id, status: parsed, events }, meta: null };
  }
}

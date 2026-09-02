import { EventEmitter } from 'events';
import { logger } from '../config/logger.config.js';

class AppEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  emitEvent(eventName, payload) {
    logger.debug(`[EventBus] Emitting event: ${eventName}`, {
      eventName,
      actorId: payload?.actorId || payload?.userId,
      resourceId: payload?.resourceId || payload?.memberId || payload?.profileId
    });

    try {
      this.emit(eventName, payload);
    } catch (error) {
      logger.error(`[EventBus] Error while dispatching event '${eventName}': ${error.message}`, { error });
    }
  }

  subscribeEvent(eventName, handler) {
    this.on(eventName, async (payload) => {
      try {
        await handler(payload);
      } catch (error) {
        logger.error(`[EventBus] Handler failed for event '${eventName}': ${error.message}`, {
          eventName,
          error: error.stack
        });
      }
    });
  }
}

export const eventBus = new AppEventBus();

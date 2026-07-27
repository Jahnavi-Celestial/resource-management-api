import { EntityManager } from "typeorm";
import { Notification } from "../entities/index.ts";
import { Manager } from "./index.ts";

export class NotificationRepository extends Manager{
  constructor(manager?: EntityManager) {
    super(manager);
  }

  async findByRecipient(recipientId: number, unreadOnly: boolean){
    const conditions: any = { recipientId };
    if (unreadOnly) conditions.isRead = false;

    return await this.manager.find(Notification, {
      where: conditions,
      order: { createdAt: "DESC" }
    });
  }

  async countUnread(recipientId: number){
    return await this.manager.count(Notification, {
      where: { recipientId, isRead: false }
    });
  }

  async findByIdAndRecipient(id: number, recipientId: number){
    return await this.manager.findOne(Notification, {
      where: { id, recipientId }
    });
  }

  async saveEntity(notification: Notification){
    return await this.manager.save(Notification, notification);
  }

  async createEntity(data: Partial<Notification>){
    return this.manager.create(Notification, data);
  }

  async markAllAsRead(recipientId: number){
    await this.manager.update(Notification, 
      { recipientId, isRead: false },
      { isRead: true }
    );
  }
}

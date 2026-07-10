import { EntityManager, Repository } from "typeorm";
import AppDataSource from "../config/db.ts";
import { Notification } from "../entities/Notification.ts";

export class NotificationRepository {
  private repository: Repository<Notification>;

  constructor(manager?: EntityManager) {
    this.repository = manager 
      ? manager.getRepository(Notification) 
      : AppDataSource.getRepository(Notification);
  }

  async findByRecipient(recipientId: number, unreadOnly: boolean){
    const conditions: any = { recipientId };
    if (unreadOnly) conditions.isRead = false;

    return await this.repository.find({
      where: conditions,
      order: { createdAt: "DESC" }
    });
  }

  async countUnread(recipientId: number){
    return await this.repository.count({
      where: { recipientId, isRead: false }
    });
  }

  async findByIdAndRecipient(id: number, recipientId: number){
    return await this.repository.findOne({
      where: { id, recipientId }
    });
  }

  async saveEntity(notification: Notification){
    return await this.repository.save(notification);
  }

  async createEntity(data: Partial<Notification>){
    return this.repository.create(data);
  }

  async markAllAsRead(recipientId: number){
    await this.repository.update(
      { recipientId, isRead: false },
      { isRead: true }
    );
  }
}

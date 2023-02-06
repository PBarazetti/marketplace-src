import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "src/order/enums/status.enum";
import { OrderItem } from "./order_item.entity";

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      default: new Date(),
    })
    order_date: Date;
  
    @Column({
      default: OrderStatus.CREATED
    })
    status: OrderStatus;
  
    @Column({
      nullable: true,
    })
    shipmentDate: Date;
  
    @Column()
    userId: string;
  
    @OneToMany(type => OrderItem, orderItem => orderItem.order, {
      eager: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    order_items: OrderItem[];

    @Column({ nullable: false, type: "float", default: 0.0 })
    totalPrice: number;
  }
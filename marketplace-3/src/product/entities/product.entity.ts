import { IsNumber, Validate } from 'class-validator';
import { OrderItem } from 'src/order/entities/order_item.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    OneToMany,
  } from 'typeorm';
  @Entity('products')
  export class Product extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    description: string;
  
    @Column('float',{
      default: 0.0
    })
    price: number;  

    @OneToMany(type => OrderItem, orderItem => orderItem.product, {
      eager: false,
    })
    order_items: OrderItem[];
  }
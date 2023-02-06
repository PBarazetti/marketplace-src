import { BaseEntity, Column, Entity,  PrimaryColumn } from "typeorm";

@Entity()
export class Stock extends BaseEntity {
    @PrimaryColumn()
    product_id: number;    

    @Column({ nullable: false, default: 0 })
    quantity: number; 
}
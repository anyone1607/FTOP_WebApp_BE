import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {Order} from "../../order/entities/order.entity";
import { User } from "../../user/entities/user.entity";
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transactionId: number;

  @Column({ nullable: false })
  transferUserId: number;

  @Column({ nullable: false })
  receiveUserId: number;

  @Column({ nullable: false })
  transactionDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  transactionAmount: number;

  @Column({ length: 100 })
  transactionDescription: string;

  @Column({ nullable: false })
  status: boolean;

  @ManyToOne(() => Order, (order) => order.orderId, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'transferUserId' })
  transferUser: User;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'receiveUserId' })
  receiveUser: User;

}

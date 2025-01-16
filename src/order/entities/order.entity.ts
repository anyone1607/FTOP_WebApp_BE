import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from '../../order-item/entities/orderItem.entity';
import { Store } from '../../store/entities/store.entity';
import { User } from '../../user/entities/user.entity';
import { Voucher } from '../../voucher/entities/voucher.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @ManyToOne(() => User, user => user.order)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Store, store => store.order)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  orderStatus: boolean;

  @Column({ nullable: false })
  orderDate: Date;

  @ManyToOne(() => Voucher, voucher => voucher.order, { nullable: true })
  @JoinColumn({ name: 'voucherId' })
  voucher: Voucher;

  @Column({ length: 50 })
  note: string;

  @Column({ nullable: false })
  totalPrice: number;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isCashedOut: boolean;
  
  @OneToMany(() => OrderItem, orderItem => orderItem.order) // Thêm quan hệ OneToMany
  orderItems: OrderItem[];
}
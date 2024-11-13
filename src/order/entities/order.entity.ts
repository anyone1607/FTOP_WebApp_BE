import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Store } from '../../store/entities/store.entity';
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

  @ManyToOne(() => Voucher, voucher => voucher.order)
  @JoinColumn({ name: 'voucherId' })
  voucher: Voucher;

  @Column({ length: 50 })
  note: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  totalPrice: number;
  
}

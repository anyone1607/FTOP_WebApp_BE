import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Store } from '../../store/entities/store.entity';
import { Order } from '../../order/entities/order.entity';
@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  voucherId: number;

  @Column({ length: 50, nullable: false })
  voucherName: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  voucherDiscount: number;

  @ManyToOne(() => Store, store => store.vouchers, { nullable: false })
  store: Store;

  @Column({ nullable: false })
  expiredDate: Date;

  @Column({ nullable: false })
  createdDate: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Order, order => order.voucher)
  order: Order[];
  
}

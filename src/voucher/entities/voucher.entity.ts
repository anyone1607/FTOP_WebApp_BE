import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Store } from '../../store/entities/store.entity'
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
}

import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Voucher } from '../../voucher/entities/voucher.entity';
import { Order } from '../../order/entities/order.entity';
@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  storeId: number;

  @Column({ length: 50, nullable: false })
  storeName: string;

  @Column()
  storeAddress: string;

  @Column()
  storePhone: number;

  @Column({ nullable: false })
  ownerId: number;

  @Column({ nullable: false })
  status: boolean;

  @OneToMany(() => Voucher, voucher => voucher.store)
  vouchers: Voucher[];

  @OneToMany(() => Order, order => order.store)
  order: Order[];
  
}

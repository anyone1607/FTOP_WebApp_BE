import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Voucher } from '../../voucher/entities/voucher.entity';
import { Order } from '../../order/entities/order.entity';
import { User } from '../../user/entities/user.entity';

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

  // join userId table user
  // @Column()
  // ownerId: number;

  @OneToOne(() => User, (user) => user.store) 
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ nullable: false })
  status: boolean;

  @OneToMany(() => Voucher, voucher => voucher.store)
  vouchers: Voucher[];

  @OneToMany(() => Order, order => order.store)
  order: Order[];
  
}

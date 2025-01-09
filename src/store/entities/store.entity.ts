import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
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



  // @OneToOne(() => User, user => user.store)
  // @JoinColumn({ name: 'ownerId' })
  // user: User;

  @OneToOne(() => User, (user) => user.store)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  status: boolean;



  // filed array storeImage
  @Column('json', { nullable: true })
  storeImage: string[];

  @OneToMany(() => Voucher, (voucher) => voucher.store)
  vouchers: Voucher[];

  @OneToMany(() => Order, (order) => order.store)
  order: Order[];
}

import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn,ManyToOne } from 'typeorm';
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


  @Column()
  ownerId: number;  // Thêm cột 'ownerId' làm khóa ngoại

  @OneToOne(() => User, (user) => user.store)  // Liên kết ngược lại từ Store sang User
  @JoinColumn({ name: 'ownerId' })  // Chỉ định khóa ngoại là 'ownerId'
  owner: User;  // Liên kết với User


  @Column({ nullable: false })
  status: boolean;

  @Column({ nullable: true, type: 'json' })
  storeImage: string[];

  @OneToMany(() => Voucher, voucher => voucher.store)
  vouchers: Voucher[];

  @OneToMany(() => Order, (order) => order.store)
  order: Order[];
  
}

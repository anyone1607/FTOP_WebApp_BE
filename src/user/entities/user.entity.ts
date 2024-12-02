import { Entity, Column, PrimaryGeneratedColumn, OneToMany,OneToOne,JoinColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { BankTransfer } from '../../banktransfer/entities/banktransfer.entity';
import {Store} from '../../store/entities/store.entity'
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  displayName: string;

  @Column()
  avatar: string;

  @Column()
  phoneNumber: string;
  
  @Column()
  role: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  walletBalance: number;

  @Column()
  isActive: boolean;

  @OneToMany(() => Order, order => order.user)
  order: Order[]

  @OneToMany(() => BankTransfer, bankTransfer => bankTransfer.user)
  bankTransfers: BankTransfer[];

  @OneToOne(() => Store, (store) => store.owner)
  store: Store;

}

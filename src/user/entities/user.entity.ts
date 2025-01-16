import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { BankTransfer } from '../../banktransfer/entities/banktransfer.entity';
import { Order } from '../../order/entities/order.entity';
import { Store } from '../../store/entities/store.entity';
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

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  role: string;

  @Column()
  password: string;

  @Column({ nullable: false, default: 0 })
  walletBalance: number;

  @Column({ nullable: true })
  pin: number;

  @Column({ nullable: true, default: null })
  refresh_token: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  update_at: Date;

  @Column()
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  @OneToMany(() => BankTransfer, (bankTransfer) => bankTransfer.user)
  bankTransfers: BankTransfer[];

  @OneToOne(() => Store, (store) => store.user)
  store: Store;
  
} 

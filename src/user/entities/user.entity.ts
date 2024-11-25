import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { BankTransfer } from '../../banktransfer/entities/banktransfer.entity';
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

  @Column()
  walletBalance: number;

  @Column()
  isActive: boolean;

  @OneToMany(() => Order, order => order.user)
  order: Order[]

  @OneToMany(() => BankTransfer, bankTransfer => bankTransfer.user)
  bankTransfers: BankTransfer[];

}

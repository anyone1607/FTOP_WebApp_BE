import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
@Entity()
export class BankTransfer {
  @PrimaryGeneratedColumn()
  transferId: number;

  @Column({ nullable: false })
  walletUserId: number;

  @ManyToOne(() => User, user => user.bankTransfers)
  @JoinColumn({ name: 'walletUserId' })  
  user: User;

  @Column({ nullable: false })
  accountNumber: number;

  @Column({ length: 50, nullable: false })
  bankName: string;

  @Column({ nullable: false })
  transferType: boolean;

  @Column({ nullable: false })
  transferAmount: number;

  @Column({ length: 100 })
  transferDescription: string;

  @Column({ nullable: false })
  transferDate: Date;

  @Column({ nullable: false })
  status: boolean;
  
}

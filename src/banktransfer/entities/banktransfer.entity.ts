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

    @Column({ nullable: true }) // có thể null
    accountNumber: number;

  @Column({ length: 100, nullable: true }) // có thể null
  bankName: string;

  @Column({ nullable: false })
  transferType: boolean; // withdraw: false, topup: true

  @Column({ nullable: false })
  transferAmount: number;

  @Column({ length: 100, nullable: true }) // có thể null
  transferDescription: string;

  @Column({ nullable: false })
  transferDate: Date;

  @Column({ nullable: false })
  status: boolean;
  
}

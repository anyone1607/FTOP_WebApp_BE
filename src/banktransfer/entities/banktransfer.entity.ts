import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BankTransfer {
  @PrimaryGeneratedColumn()
  transferId: number;

  @Column({ nullable: false })
  walletUserId: number;

  @Column({ nullable: false })
  accountNumber: number;

  @Column({ length: 50, nullable: false })
  bankName: string;

  @Column({ nullable: false })
  transferType: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  transferAmount: number;

  @Column({ length: 100 })
  transferDescription: string;

  @Column({ nullable: false })
  transferDate: Date;

  @Column({ nullable: false })
  status: boolean;
}

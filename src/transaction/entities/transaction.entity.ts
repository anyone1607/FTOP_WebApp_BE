import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transactionId: number;

  @Column({ nullable: false })
  transferUserId: number;

  @Column({ nullable: false })
  receiveUserId: number;

  @Column({ nullable: false })
  transactionDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  transactionAmount: number;

  @Column({ length: 100 })
  transactionDescription: string;

  @Column({ nullable: false })
  status: boolean;

  @Column({ nullable: false })
  orderId: number;
}

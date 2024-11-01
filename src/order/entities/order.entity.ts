import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  storeId: number;

  @Column()
  orderStatus: boolean;

  @Column({ nullable: false })
  orderDate: Date;

  @Column()
  voucherId: number;

  @Column({ length: 50 })
  note: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  totalPrice: number;
}

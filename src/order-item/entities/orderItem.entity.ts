import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  orderItemId: number;

  @Column({ nullable: false })
  orderId: number;

  @Column({ nullable: false })
  productId: number;

  @Column({ nullable: false })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  unitPrice: number;

  @Column()
  voucherId: number;
  
}

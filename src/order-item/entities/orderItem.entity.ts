import { Column, Entity, PrimaryGeneratedColumn,ManyToOne,JoinColumn } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  orderItemId: number;

  @Column({ nullable: false })
  orderId: number;

  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'orderId' }) // Đảm bảo khóa ngoại liên kết
  order: Order;

  @Column({ nullable: false })
  productId: number;

  @ManyToOne(() => Product, product => product.orderItems)
  @JoinColumn({ name: 'productId' }) // Đảm bảo khóa ngoại liên kết
  product: Product;

  @Column({ nullable: false })
  quantity: number;

  @Column({nullable: false })
  unitPrice: number;

  
}
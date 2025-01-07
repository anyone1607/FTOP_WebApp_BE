import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn,OneToMany  } from 'typeorm';
import { Store } from '../../store/entities/store.entity';
import { Category } from '../../category/entities/category.entity';
import { OrderItem } from 'src/order-item/entities/orderItem.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ length: 50, nullable: false })
  productName: string;

  @Column({nullable : false})
  productPrice: number;

  @ManyToOne(() => Category, (category) =>category.categoryId)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: false })
  categoryId: number;

  @Column({ nullable: false })
  status: boolean;

  @Column({ nullable: false })
  productImage: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Store,(store) =>store.storeId)  // Many-to-One relationship with Store
  @JoinColumn({ name: 'storeId' })  // Đảm bảo storeId là khóa ngoại
  store: Store;

  @Column({ nullable: false })
  storeId: number;  // storeId là khóa ngoại  

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];
}
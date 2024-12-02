import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn  } from 'typeorm';
import { Store } from '../../store/entities/store.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ length: 50, nullable: false })
  productName: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  productPrice: number;

  @ManyToOne(() => Category, (category) =>category.categoryId)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: false })
  categoryId: number;  // categoryId là khóa ngoại

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
}

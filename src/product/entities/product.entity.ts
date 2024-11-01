import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ length: 50, nullable: false })
  productName: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  productPrice: number;

  @Column({ nullable: false })
  categoryId: number;

  @Column({ nullable: false })
  status: boolean;

  @Column({ nullable: false })
  storeId: number;
}

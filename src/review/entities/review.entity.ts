import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @Column({ length: 100 })
  reviewDesscription: string;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  stars: number;

  @Column({ nullable: false })
  storeId: number;
}

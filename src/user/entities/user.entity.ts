import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  displayName: string;
  
  @Column()
  role: string;

  @Column()
  password: string;

  @Column()
  walletBalance: number;

  @Column()
  isActive: boolean;

}

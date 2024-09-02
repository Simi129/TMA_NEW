import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telegramId: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  referrerId: number;

  @ManyToOne(() => User, user => user.referrals)
  referrer: User;

  @OneToMany(() => User, user => user.referrer)
  referrals: User[];
}
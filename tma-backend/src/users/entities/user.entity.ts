import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telegramId: string;

  @Column()
  username: string;

  @Column({ default: false })
  is_premium: boolean;

  @Column({ default: 0 })
  coins: number;

  @Column({ default: 1 })
  level: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_login: Date;

  @Column({ nullable: true })
  referrer_id: number;

  @ManyToOne(() => User, user => user.referrals)
  referrer: User;

  @OneToMany(() => User, user => user.referrer)
  referrals: User[];
}
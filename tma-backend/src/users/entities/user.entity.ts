import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: "varchar", unique: true })
    telegramId!: string;

    @Column({ type: "varchar" })
    username!: string;

    @Column({ type: "varchar", nullable: true })
    firstName?: string;

    @Column({ type: "varchar", nullable: true })
    lastName?: string;

    @Column({ type: "varchar", nullable: true })
    languageCode?: string;
}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUser } from 'src/schemas/IUser';
import { Article } from 'src/article/entities/article.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 32, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 256 })
  name: string;

  @Exclude()
  @Column({ type: 'varchar', length: 128 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 256 })
  password: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}

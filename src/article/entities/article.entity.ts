import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IArticle } from 'src/schemas/IArticle';
import { User } from 'src/users/entities/user.entity';

@Entity('article')
export class Article implements IArticle {
  @PrimaryGeneratedColumn()
  articleId: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (author) => author.articles)
  author: User;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

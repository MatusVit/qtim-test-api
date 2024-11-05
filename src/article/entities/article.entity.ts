import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IArticle } from '../../schemas/IArticle';

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

  @Column({ name: 'authorUserId' })
  authorUserId: number;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

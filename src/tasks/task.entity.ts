import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {TaskStatus} from './tasks.status.enum';
//Database Schema
@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
}

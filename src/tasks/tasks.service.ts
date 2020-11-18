import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.status.enum';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException('Task with ID not found');
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid.v1(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException('Task with ID not found');
    }
  }

  //alternate deletion
  // async deleteTask(id: number): Promise<Task> {
  //   const found = await this.taskRepository.findOne(id);
  //   const isRemoved = await this.taskRepository.remove(found);
  //   return isRemoved;
  // }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const found = await this.getTaskById(id, user);
    found.status = status;
    await found.save();
    return found;
  }

  // deleteTask(id: string):void {
  //   const found = this.getTaskById(id);
  //    this.tasks = this.tasks.filter(task => task.id !== found.id);
  // }

  // updateTaskStatus(id:string, status:TaskStatus):Task{
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
//DTO - How data is sent over the network

/*

Classes to be used for DTOs rather than interface
*/

// Two pipes -> Parameter level and Handler level

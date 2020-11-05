import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTasksFilterDto):Task[]{
  //   const {status, search} = filterDto;

  //   let tasks = this.getAllTasks()
  //   if(status){
  //     tasks = tasks.filter(task=> task.status === status)
  //   }
  //   if(search){
  //     tasks = tasks.filter(task=> task.title.includes(search) || task.description.includes(search))
  //   }
  //   return tasks;
  // }
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException('Task with ID not found');
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
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

  async deleteTask(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    const isRemoved = await this.taskRepository.remove(found);
    return isRemoved;
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

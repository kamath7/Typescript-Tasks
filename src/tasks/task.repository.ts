import { Entity, EntityRepository, Repository } from "typeorm";
import {TaskStatus} from '../tasks/tasks.status.enum';
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
async createTask(createTaskDto: CreateTaskDto ): Promise<Task>{
    const task = new Task();
    const { title, description } = createTaskDto;

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
}
}
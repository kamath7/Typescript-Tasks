import { User } from "src/auth/user.entity";
import { Entity, EntityRepository, Repository } from "typeorm";
import {TaskStatus} from '../tasks/tasks.status.enum';
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

async getTasks (filterDto: GetTasksFilterDto, user:User): Promise<Task[]>{
    const {status, search} = filterDto;
    const query = this.createQueryBuilder('task')

    if(status){
        query.andWhere('task.status = :status',{status}); //SQL where clause. :status is a variable
    }
    if(search){
        query.andWhere('task.title LIKE :search  OR task.description LIKE :search',{search: `%${search}%`}) //% %is for partial matching 
    }
    const tasks = await query.getMany();
    return tasks;

}


async createTask(createTaskDto: CreateTaskDto, user: User ): Promise<Task>{
    const task = new Task();
    const { title, description } = createTaskDto;

    task.title = title;
    task.description = description;
    task.user = user;
    task.status = TaskStatus.OPEN;
    await task.save();
    delete task.user;

    return task;
}
}
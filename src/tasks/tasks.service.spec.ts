import { Test } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './tasks.status.enum';

const mockUser = { id: 12, username: 'Kams' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});
describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });
  describe('Get Tasks', () => {
    it('Gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some query',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(result).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('Calls Repo and retrieves the task', async () => {
      const mockTask = taskRepository.findOne.mockResolvedValue({
        title: 'Test Task',
        description: 'Test Description',
      });
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });
  });
  it('Throws an error', () => {
    taskRepository.findOne.mockResolvedValue(null);
    expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow();
  });
  describe('createTask', () => {
    it('Creates a task and returns created task', async () => {
      taskRepository.createTask.mockResolvedValue('someTask');

      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const createTaskDto = { title: 'Test Task', description: 'Test Desc' };
      const result = tasksService.createTask(createTaskDto, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(result).toEqual('someTask');
    });
  });

  describe('Delete task', () => {
    it('Call deleteTask to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });
    it('Throw error when task not found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow();
    });
  });
  describe('Update Task status', () => {
    it('Updates task', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});

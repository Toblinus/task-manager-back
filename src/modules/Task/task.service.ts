import { Injectable } from '@nestjs/common';
import { Task } from 'src/db';

export interface ITaskDto {
  text: string;
  parent?: string;
  author: string;
}

@Injectable()
export class TaskService {
  async create({ text }: ITaskDto): Promise<InstanceType<typeof Task>> {
    const task = new Task({
      text,
    });

    await task.save();

    return task;
  }
}
